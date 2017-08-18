define("ace/mode/yaml_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var YamlHighlightRules = function() {
    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "#.*$"
            }, {
                token : "list.markup",
                regex : /^(?:-{3}|\.{3})\s*(?=#|$)/
            },  {
                token : "list.markup",
                regex : /^\s*[\-?](?:$|\s)/
            }, {
                token: "constant",
                regex: "!![\\w//]+"
            }, {
                token: "constant.language",
                regex: "[&\\*][a-zA-Z0-9-_]+"
            }, {
                token: ["meta.tag", "keyword"],
                regex: /^(\s*\w.*?)(:(?:\s+|$))/
            },{
                token: ["meta.tag", "keyword"],
                regex: /(\w+?)(\s*:(?:\s+|$))/
            }, {
                token : "keyword.operator",
                regex : "<<\\w*:\\w*"
            }, {
                token : "keyword.operator",
                regex : "-\\s*(?=[{])"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line string start
                regex : /[|>][-+\d\s]*$/,
                onMatch: function(val, state, stack, line) {
                    var indent = /^\s*/.exec(line)[0];
                    if (stack.length < 1) {
                        stack.push(this.next);
                    } else {
                        stack[0] = "mlString";
                    }

                    if (stack.length < 2) {
                        stack.push(indent.length);
                    }
                    else {
                        stack[1] = indent.length;
                    }
                    return this.token;
                },
                next : "mlString"
            }, {
                token : "string", // single quoted string
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "constant.numeric", // float
                regex : /(\b|[+\-\.])[\d_]+(?:(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)/
            }, {
                token : "constant.numeric", // other number
                regex : /[+\-]?\.inf\b|NaN\b|0x[\dA-Fa-f_]+|0b[10_]+/
            }, {
                token : "constant.language.boolean",
                regex : "\\b(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }
        ],
        "mlString" : [
            {
                token : "indent",
                regex : /^\s*$/
            }, {
                token : "indent",
                regex : /^\s*/,
                onMatch: function(val, state, stack) {
                    var curIndent = stack[1];

                    if (curIndent >= val.length) {
                        this.next = "start";
                        stack.splice(0);
                    }
                    else {
                        this.next = "mlString";
                    }
                    return this.token;
                },
                next : "mlString"
            }, {
                token : "string",
                regex : '.+'
            }
        ]};
    this.normalizeRules();

};

oop.inherits(YamlHighlightRules, TextHighlightRules);

exports.YamlHighlightRules = YamlHighlightRules;
});

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

define("ace/mode/yaml_liquid_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/yaml_highlight_rules","ace/mode/liquid_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var YamlHighlightRules = require("./yaml_highlight_rules").YamlHighlightRules;
var LiquidLangHighlightRules = require("./liquid_highlight_rules").LiquidLangHighlightRules;

var YamlLiquidHighlightRules = function() {
    YamlHighlightRules.call(this); // TODO: Liquid inside string doen't get correct highlighting.
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

oop.inherits(YamlLiquidHighlightRules, YamlHighlightRules);
exports.YamlLiquidHighlightRules = YamlLiquidHighlightRules;

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

define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var range = this.indentationBlock(session, row);
        if (range)
            return range;

        var re = /\S/;
        var line = session.getLine(row);
        var startLevel = line.search(re);
        if (startLevel == -1 || line[startLevel] != "#")
            return;

        var startColumn = line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            line = session.getLine(row);
            var level = line.search(re);

            if (level == -1)
                continue;

            if (line[level] != "#")
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var indent = line.search(/\S/);
        var next = session.getLine(row + 1);
        var prev = session.getLine(row - 1);
        var prevIndent = prev.search(/\S/);
        var nextIndent = next.search(/\S/);

        if (indent == -1) {
            session.foldWidgets[row - 1] = prevIndent!= -1 && prevIndent < nextIndent ? "start" : "";
            return "";
        }
        if (prevIndent == -1) {
            if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
                session.foldWidgets[row - 1] = "";
                session.foldWidgets[row + 1] = "";
                return "start";
            }
        } else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
            if (session.getLine(row - 2).search(/\S/) == -1) {
                session.foldWidgets[row - 1] = "start";
                session.foldWidgets[row + 1] = "";
                return "";
            }
        }

        if (prevIndent!= -1 && prevIndent < indent)
            session.foldWidgets[row - 1] = "start";
        else
            session.foldWidgets[row - 1] = "";

        if (indent < nextIndent)
            return "start";
        else
            return "";
    };

}).call(FoldMode.prototype);

});

define("ace/mode/yaml",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/yaml_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/folding/coffee"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var YamlHighlightRules = require("./yaml_highlight_rules").YamlHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var FoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    this.HighlightRules = YamlHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "#";
    
    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

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


    this.$id = "ace/mode/yaml";
}).call(Mode.prototype);

exports.Mode = Mode;

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

define("ace/mode/yaml_liquid",["require","exports","module","ace/lib/oop","ace/mode/yaml_liquid_highlight_rules","ace/mode/behaviour/liquid","ace/mode/yaml","ace/mode/liquid"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var YamlLiquidHighlightRules = require("./yaml_liquid_highlight_rules").YamlLiquidHighlightRules;
var LiquidBehaviour = require("./behaviour/liquid").LiquidBehaviour;
var YamlMode = require("./yaml").Mode;
var LiquidMode = require("./liquid").ModeInline;

var Mode = function() {
    YamlMode.call(this);
    this.HighlightRules = YamlLiquidHighlightRules;  
    this.$behaviour = new LiquidBehaviour();

    this.createModeDelegates({
        "liquid-": LiquidMode 
    });
};
oop.inherits(Mode, YamlMode);

(function() {
    this.$id = "ace/mode/yaml_liquid";
}).call(Mode.prototype);

exports.Mode = Mode;

});
