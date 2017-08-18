define("ace/snippets/yaml_liquid",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# Liquid\n\
# Comment - https://shopify.github.io/liquid/tags/comment/\n\
snippet lcomment\n\
	{% comment %}\n\
		${1}\n\
	{% endcomment %}\n\
	${2}\n\
# Control flow - https://shopify.github.io/liquid/tags/control-flow/\n\
snippet lif\n\
	{% if ${1:condition} %}\n\
		${2}\n\
	{% endif %}\n\
	${3}\n\
snippet lunless\n\
	{% unless ${1:condition} %}\n\
		${2}\n\
	{% endunless %}\n\
	${3}\n\
snippet lelse\n\
	{% if ${1:condition} %}\n\
		${2}\n\
	{% else %}\n\
		${3}\n\
	{% endif %}\n\
	${4}\n\
snippet lelsif\n\
	{% if ${1:condition 1} %}\n\
		${4}\n\
	{% elsif ${2:condition 2} %}\n\
		${5}${3:\n\
	{% else %\\}\n\
		${6}}\n\
	{% endif %}\n\
	${7}\n\
snippet lcase\n\
	{% case ${1:value} %}\n\
		{% when ${2:value 1} %}\n\
			${5}\n\
		{% when ${3:value 2} %}\n\
			${6}${4:\n\
		{% else %\\}\n\
			${7}}\n\
	{% endcase %}\n\
	${8}\n\
# Iteration - https://shopify.github.io/liquid/tags/iteration/\n\
snippet lfor\n\
	{% for ${1:item} in ${2:${1:item}s}${3} %}\n\
		${4}\n\
	{% endfor %}\n\
	${5}\n\
# Raw - https://shopify.github.io/liquid/tags/raw/\n\
snippet lraw\n\
	{% raw %}\n\
		${1}\n\
	{% endraw %}\n\
	${2}\n\
\n\
# YAML\n\
";
exports.scope = "yaml_liquid";

});
