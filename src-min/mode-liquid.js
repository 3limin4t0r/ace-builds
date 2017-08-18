define("ace/mode/liquid_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){var e="abs|append|capitalize|ceil|compact|date|default|divided_by|downcase|escape|escape_once|first|floor|join|last|lstrip|map|minus|modulo|newline_to_br|plus|prepend|remove|remove_first|replace|replace_first|reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|url_decode|url_encode",t="capture|endcapture|case|endcase|when|cycle|for|endfor|in|reversed|if|endif|else|elsif|include|endinclude|unless|endunless|break|continue|style|text|image|widget|plugin|marker|endmarker|tablerow|endtablerow",n="forloop|tablerowloop",r="assign",i=this.createKeywordMapper({"variable.language":n,keyword:t,"support.function":e,"keyword.definition":r},"identifier");this.$rules={start:[{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:i,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"/|\\*|\\-|\\+|=|!=|\\?\\:"},{token:"paren.lparen",regex:/[\[\({]/},{token:"paren.rparen",regex:/[\])}]/},{token:"text",regex:"\\s+"}]}};r.inherits(s,i),t.LiquidLangHighlightRules=s;var o=function(){i.call(this);var e=[{token:"comment.start.liquid",regex:"{% comment %}|{%- comment -%}",push:[{token:"comment.end.liquid",regex:"{% endcomment %}|{%- endcomment -%}",next:"pop",defaultToken:"comment"}]},{token:"support.constant.start",regex:"{% raw %}|{%- raw -%}",push:[{token:"support.constant.end",regex:"{% endraw %}|{%- endraw -%}",next:"pop"}]},{token:"support.variable.liquid_tag.start",regex:"{(?:{|%)-? ",push:"liquid-start"}],t=[{token:"support.variable.liquid_tag.end",regex:" -?(?:}|%)}",next:"pop"}];for(var n in this.$rules)this.$rules[n].unshift.apply(this.$rules[n],e);this.embedRules(s,"liquid-",t,["start"]),this.normalizeRules()};r.inherits(o,i),t.LiquidHighlightRules=o}),define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){"use strict";var r=e("../range").Range,i=function(){};(function(){this.checkOutdent=function(e,t){return/^\s+$/.test(e)?/^\s*\}/.test(t):!1},this.autoOutdent=function(e,t){var n=e.getLine(t),i=n.match(/^(\s*\})/);if(!i)return 0;var s=i[1].length,o=e.findMatchingBracket({row:t,column:s});if(!o||o.row==t)return 0;var u=this.$getIndent(e.getLine(o.row));e.replace(new r(t,0,t,s-1),u)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(i.prototype),t.MatchingBraceOutdent=i}),define("ace/mode/behaviour/liquid",["require","exports","module","ace/lib/oop","ace/mode/behaviour"],function(e,t,n){"use strict";var r=e("../../lib/oop"),i=e("../behaviour").Behaviour,s=function(){this.add("autoclosing","insertion",function(e,t,n,r,i){if(i=="{"||i=="%"){var s=n.getCursorPositionScreen();if(s.column<1)return;var o=r.getDocument();if(o.getLine(s.row)[s.column-1]!="{")return;return{text:i+"  "+(i=="{"?"}":"%")+"}",selection:[2,2]}}})};r.inherits(s,i),t.LiquidBehaviour=s}),define("ace/mode/liquid",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/liquid_highlight_rules","ace/mode/liquid_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/liquid"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text").Mode,s=e("./liquid_highlight_rules").LiquidHighlightRules,o=e("./liquid_highlight_rules").LiquidLangHighlightRules,u=e("./matching_brace_outdent").MatchingBraceOutdent,a=e("./behaviour/liquid").LiquidBehaviour,f=function(){this.LiquidLangHighlightRules=o};r.inherits(f,i),function(){this.$id="ace/mode/liquid-inline"}.call(f.prototype),t.ModeInline=f;var l=function(){i.call(this),this.HighlightRules=s,this.$outdent=new u,this.$behaviour=new a,this.createModeDelegates({"liquid-":f})};r.inherits(l,i),function(){this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=this.getTokenizer().getLineTokens(t,e),s=i.tokens;if(s.length&&s[s.length-1].type=="comment")return r;if(e=="start"){var o=t.match(/^.*[\{\(\[]\s*$/);o&&(r+=n)}return r},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/liquid"}.call(l.prototype),t.Mode=l})