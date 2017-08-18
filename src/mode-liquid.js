define("ace/mode/liquid_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var LiquidLangHighlightRules = function() {
    var builtinFunctions = (
        "abs|append|capitalize|ceil|compact|date|default|divided_by|downcase|" +
        "escape|escape_once|first|floor|join|last|lstrip|map|minus|modulo|" +
        "newline_to_br|plus|prepend|remove|remove_first|replace|replace_first|" +
        "reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|" +
        "strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|" +
        "url_decode|url_encode"
    );

    var keywords = (
        "capture|endcapture|case|endcase|when|cycle|for|" +
        "endfor|in|reversed|if|endif|else|elsif|include|endinclude|unless|" +
        "endunless|break|continue|" +
        "style|text|image|widget|plugin|marker|endmarker|tablerow|endtablerow"
    );

    var builtinVariables = 'forloop|tablerowloop';

    var definitions = ("assign");

    var keywordMapper = this.createKeywordMapper({
        "variable.language": builtinVariables,
        "keyword": keywords,
        "support.function": builtinFunctions,
        "keyword.definition": definitions
    }, "identifier");

    this.$rules = {
        "start" : [{
            token : "string", // single line
            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
        }, {
            token : "string", // single line
            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
        }, {
            token : "constant.numeric", // hex
            regex : "0[xX][0-9a-fA-F]+\\b"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : "constant.language.boolean",
            regex : "(?:true|false)\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "/|\\*|\\-|\\+|=|!=|\\?\\:"
        }, {
            token : "paren.lparen",
            regex : /[\[\({]/
        }, {
            token : "paren.rparen",
            regex : /[\])}]/
        }, {
            token : "text",
            regex : "\\s+"
        }]
    };
};
oop.inherits(LiquidLangHighlightRules, TextHighlightRules);
exports.LiquidLangHighlightRules = LiquidLangHighlightRules;



var LiquidHighlightRules = function() {
    TextHighlightRules.call(this);
    var startRules = [{
        token : "comment.start.liquid",
        regex : "{% comment %}|{%- comment -%}",
        push  : [{
            token        : "comment.end.liquid",
            regex        : "{% endcomment %}|{%- endcomment -%}",
            next         : "pop",
            defaultToken : "comment"
        }]
    }, {
        token : "support.constant.start",
        regex : "{% raw %}|{%- raw -%}",
        push  : [{
            token : "support.constant.end",
            regex : "{% endraw %}|{%- endraw -%}",
            next  : "pop"
        }]
    }, {
        token : "support.variable.liquid_tag.start",
        regex : "{(?:{|%)-? ",
        push  : "liquid-start"
    }];

    var endRules = [{
        token : "support.variable.liquid_tag.end",
        regex : " -?(?:}|%)}",
        next  : "pop"
    }];

    for (var key in this.$rules)
        this.$rules[key].unshift.apply(this.$rules[key], startRules);

    this.embedRules(LiquidLangHighlightRules, "liquid-", endRules, ["start"]);

    this.normalizeRules();
};

oop.inherits(LiquidHighlightRules, TextHighlightRules);
exports.LiquidHighlightRules = LiquidHighlightRules;

});

define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

define("ace/mode/behaviour/liquid",["require","exports","module","ace/lib/oop","ace/mode/behaviour"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Behaviour = require("../behaviour").Behaviour;

var LiquidBehaviour = function () {
    this.add("autoclosing", "insertion", function (state, action, editor, session, text) {
        if (text == '{' || text == '%') {
            var position = editor.getCursorPositionScreen();

            if (position.column < 1)
                return;

            var doc = session.getDocument();

            if (doc.getLine(position.row)[position.column - 1] != "{")
                return;

            return {
                text: text + "  " + ((text == "{") ? "}" : "%") + "}",
                selection: [2, 2]
            };
        }
    });
};

oop.inherits(LiquidBehaviour, Behaviour);
exports.LiquidBehaviour = LiquidBehaviour;

});

define("ace/mode/liquid",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/liquid_highlight_rules","ace/mode/liquid_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/liquid"], function(require, exports, module) {
"use strict"

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var LiquidHighlightRules = require("./liquid_highlight_rules").LiquidHighlightRules;
var LiquidLangHighlightRules = require("./liquid_highlight_rules").LiquidLangHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var LiquidBehaviour = require("./behaviour/liquid").LiquidBehaviour;



var LiquidMode = function() {
    this.LiquidLangHighlightRules = LiquidLangHighlightRules;
}
oop.inherits(LiquidMode, TextMode);

(function() {
    this.$id = "ace/mode/liquid-inline"
}).call(LiquidMode.prototype);
exports.ModeInline = LiquidMode;



var Mode = function() {
    TextMode.call(this);

    this.HighlightRules = LiquidHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new LiquidBehaviour();

    this.createModeDelegates({
        "liquid-": LiquidMode
    });
};
oop.inherits(Mode, TextMode);

(function() {
    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/liquid";
}).call(Mode.prototype);

exports.Mode = Mode;

});
