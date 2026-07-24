export const getTypstCompletions = (monaco: any, range: any) => {
  const K = monaco.languages.CompletionItemKind;
  const I = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;

  const create = (label: string, kind: any, insertText: string, detail: string) => ({
    label,
    kind,
    insertText,
    insertTextRules: I,
    detail,
    range
  });

  return [
    // --- Keywords ---
    create('import', K.Keyword, 'import "${1:module}": ${2:items}', 'Keyword'),
    create('include', K.Keyword, 'include "${1:file.typ}"', 'Keyword'),
    create('show', K.Keyword, 'show ${1:selector}: ${2:it} => { ${3} }', 'Keyword'),
    create('set', K.Keyword, 'set ${1:rule}(${2:properties})', 'Keyword'),
    create('let', K.Keyword, 'let ${1:name} = ${2:value}', 'Keyword'),
    create('if', K.Keyword, 'if ${1:condition} {\n  ${2}\n}', 'Keyword'),
    create('else', K.Keyword, 'else {\n  ${1}\n}', 'Keyword'),
    create('while', K.Keyword, 'while ${1:condition} {\n  ${2}\n}', 'Keyword'),
    create('for', K.Keyword, 'for ${1:item} in ${2:array} {\n  ${3}\n}', 'Keyword'),
    create('return', K.Keyword, 'return ${1:value}', 'Keyword'),
    create('break', K.Keyword, 'break', 'Keyword'),
    create('continue', K.Keyword, 'continue', 'Keyword'),

    // --- Layout ---
    create('page', K.Function, 'page(width: ${1:auto}, height: ${2:auto}, margin: ${3:auto})[${4}]', 'Layout'),
    create('pagebreak', K.Function, 'pagebreak()', 'Layout'),
    create('align', K.Function, 'align(${1:center})[${2:content}]', 'Layout'),
    create('place', K.Function, 'place(${1:top + right}, dx: ${2:0pt}, dy: ${3:0pt})[${4:content}]', 'Layout'),
    create('pad', K.Function, 'pad(${1:10pt})[${2}]', 'Layout'),
    create('move', K.Function, 'move(dx: ${1:10pt}, dy: ${2:10pt})[${3}]', 'Layout'),
    create('scale', K.Function, 'scale(x: ${1:150%}, y: ${2:150%})[${3}]', 'Layout'),
    create('rotate', K.Function, 'rotate(${1:45deg})[${2}]', 'Layout'),
    create('hide', K.Function, 'hide[${1}]', 'Layout'),
    create('grid', K.Function, 'grid(\n  columns: (${1:1fr, 1fr}),\n  gutter: ${2:10pt},\n  [${3:cell1}],\n  [${4:cell2}]\n)', 'Layout'),
    create('stack', K.Function, 'stack(dir: ${1:ttb}, spacing: ${2:10pt}, ${3})', 'Layout'),
    create('columns', K.Function, 'columns(${1:2}, gutter: ${2:10pt})[${3}]', 'Layout'),
    create('colbreak', K.Function, 'colbreak()', 'Layout'),
    create('box', K.Function, 'box(width: ${1:auto}, height: ${2:auto})[${3}]', 'Layout'),
    create('block', K.Function, 'block(width: ${1:100%}, height: ${2:auto}, fill: ${3:none})[${4}]', 'Layout'),
    create('v', K.Function, 'v(${1:10pt})', 'Layout (Vertical Space)'),
    create('h', K.Function, 'h(${1:10pt})', 'Layout (Horizontal Space)'),

    // --- Model ---
    create('heading', K.Function, 'heading(level: ${1:1})[${2:Title}]', 'Model'),
    create('list', K.Function, 'list([${1:item 1}], [${2:item 2}])', 'Model'),
    create('enum', K.Function, 'enum([${1:item 1}], [${2:item 2}])', 'Model'),
    create('terms', K.Function, 'terms(([${1:term}], [${2:description}]))', 'Model'),
    create('table', K.Function, 'table(\n  columns: ${1:2},\n  align: ${2:center},\n  [${3:Header 1}], [${4:Header 2}],\n  [${5:Cell 1}], [${6:Cell 2}]\n)', 'Model'),
    create('figure', K.Function, 'figure(\n  image("${1:path.png}", width: ${2:80%}),\n  caption: [${3:caption}]\n)', 'Model'),
    create('quote', K.Function, 'quote(block: ${1:true}, attribution: [${2:author}])[${3:quote text}]', 'Model'),
    create('bibliography', K.Function, 'bibliography("${1:refs.bib}")', 'Model'),
    create('cite', K.Function, 'cite(<${1:label}>)', 'Model'),
    create('ref', K.Function, 'ref(<${1:label}>)', 'Model'),
    create('link', K.Function, 'link("${1:url}")[${2:text}]', 'Model'),
    create('outline', K.Function, 'outline(title: [${1:Contents}], depth: ${2:3})', 'Model'),
    create('document', K.Function, 'document(title: "${1:Title}", author: ("${2:Author}",))', 'Model'),

    // --- Text ---
    create('text', K.Function, 'text(size: ${1:11pt}, font: "${2:Arial}", fill: ${3:black})[${4}]', 'Text'),
    create('strong', K.Function, 'strong[${1:text}]', 'Text'),
    create('emph', K.Function, 'emph[${1:text}]', 'Text'),
    create('underline', K.Function, 'underline[${1:text}]', 'Text'),
    create('strike', K.Function, 'strike[${1:text}]', 'Text'),
    create('overline', K.Function, 'overline[${1:text}]', 'Text'),
    create('sub', K.Function, 'sub[${1:text}]', 'Text'),
    create('super', K.Function, 'super[${1:text}]', 'Text'),
    create('smallcaps', K.Function, 'smallcaps[${1:text}]', 'Text'),
    create('lower', K.Function, 'lower[${1:TEXT}]', 'Text'),
    create('upper', K.Function, 'upper[${1:text}]', 'Text'),
    create('raw', K.Function, 'raw("${1:code}", block: ${2:false})', 'Text'),
    create('lorem', K.Function, 'lorem(${1:50})', 'Text'),
    create('highlight', K.Function, 'highlight(fill: ${1:yellow})[${2:text}]', 'Text'),

    // --- Math ---
    create('math.equation', K.Function, 'math.equation(block: ${1:true})[${2}]', 'Math'),
    create('math.frac', K.Function, 'math.frac(${1:num}, ${2:denom})', 'Math'),
    create('math.mat', K.Function, 'math.mat((${1:1}, ${2:2}), (${3:3}, ${4:4}))', 'Math'),
    create('math.vec', K.Function, 'math.vec(${1:1}, ${2:2})', 'Math'),
    create('math.cases', K.Function, 'math.cases(${1:x}, ${2:y})', 'Math'),
    create('math.cancel', K.Function, 'math.cancel(${1:x})', 'Math'),
    create('math.binom', K.Function, 'math.binom(${1:n}, ${2:k})', 'Math'),
    create('math.roots', K.Function, 'math.roots(${1:x})', 'Math'),
    create('math.op', K.Function, 'math.op("${1:sin}")', 'Math'),

    // --- Visualize ---
    create('image', K.Function, 'image("${1:path.png}", width: ${2:100%})', 'Visualize'),
    create('rect', K.Function, 'rect(width: ${1:100%}, height: ${2:50pt}, fill: ${3:blue})[${4}]', 'Visualize'),
    create('square', K.Function, 'square(size: ${1:50pt}, fill: ${2:red})[${3}]', 'Visualize'),
    create('circle', K.Function, 'circle(radius: ${1:25pt}, fill: ${2:green})[${3}]', 'Visualize'),
    create('ellipse', K.Function, 'ellipse(width: ${1:50pt}, height: ${2:25pt}, fill: ${3:yellow})[${4}]', 'Visualize'),
    create('line', K.Function, 'line(length: ${1:100%}, stroke: ${2:1pt})', 'Visualize'),
    create('polygon', K.Function, 'polygon(fill: ${1:blue}, (${2:0pt}, ${3:0pt}), (${4:50pt}, ${5:0pt}), (${6:25pt}, ${7:50pt}))', 'Visualize'),
    create('path', K.Function, 'path(fill: ${1:none}, stroke: ${2:1pt}, (${3:0pt}, ${4:0pt}), (${5:50pt}, ${6:50pt}))', 'Visualize'),

    // --- Introspection ---
    create('counter', K.Function, 'counter(${1:heading}).display()', 'Introspection'),
    create('state', K.Function, 'state("${1:key}", ${2:value})', 'Introspection'),
    create('query', K.Function, 'query(${1:heading})', 'Introspection'),
    create('locate', K.Function, 'locate(loc => { ${1} })', 'Introspection'),
    create('metadata', K.Function, 'metadata(${1:value})', 'Introspection'),

    // --- Data Loading ---
    create('json', K.Function, 'json("${1:data.json}")', 'Data Loading'),
    create('csv', K.Function, 'csv("${1:data.csv}")', 'Data Loading'),
    create('yaml', K.Function, 'yaml("${1:data.yaml}")', 'Data Loading'),
    create('toml', K.Function, 'toml("${1:data.toml}")', 'Data Loading'),
    create('xml', K.Function, 'xml("${1:data.xml}")', 'Data Loading'),
    create('read', K.Function, 'read("${1:data.txt}")', 'Data Loading'),

    // --- Foundations ---
    create('type', K.Function, 'type(${1:value})', 'Foundations'),
    create('repr', K.Function, 'repr(${1:value})', 'Foundations'),
    create('panic', K.Function, 'panic("${1:Error message}")', 'Foundations'),
    create('assert', K.Function, 'assert(${1:condition}, message: "${2:Error}")', 'Foundations'),
    create('eval', K.Function, 'eval("${1:1 + 1}")', 'Foundations'),
    create('calc.abs', K.Function, 'calc.abs(${1:x})', 'Foundations (Calc)'),
    create('calc.min', K.Function, 'calc.min(${1:x}, ${2:y})', 'Foundations (Calc)'),
    create('calc.max', K.Function, 'calc.max(${1:x}, ${2:y})', 'Foundations (Calc)'),
    create('calc.pow', K.Function, 'calc.pow(${1:x}, ${2:y})', 'Foundations (Calc)'),
    create('calc.round', K.Function, 'calc.round(${1:x}, digits: ${2:0})', 'Foundations (Calc)'),
  ];
};
