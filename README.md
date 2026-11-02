# Compiler Studio · Jenga Code

A standalone browser compiler visualiser in the site's copper-and-parchment design, with the same compass logo. All lexer, parser, compiler, teaching-machine and interface source is included. No server, npm build, external runtime dependency or API key is needed.

## Install

Extract the ZIP into `public_html/apps/`. The entry point should be:

`public_html/apps/compiler-studio/index.html`

After upload, the app address is `https://jenga-code.com/apps/compiler-studio/`.

Keep the included JS, CSS and assets together. The home page and application directory are not modified by this package. For a local preview, run START-CHROME.bat on Windows with Python 3 installed, or `python3 preview_server.py`. Ports 8865–8875 are tried. Open through HTTP(S), not file://, because the app uses JavaScript modules.

## How to use it

1. Choose an example or edit the source.
2. Compile. Ctrl+Enter in the source editor also compiles.
3. Inspect Tokens, Syntax tree, Instructions or Teaching CPU.
4. Step through instructions, or Run at the selected speed. Pause to inspect registers, RAM and stack. The last 300 executed instructions can be undone with Back.
5. In Instructions, click a circle to set a breakpoint before that instruction. Run pauses there; Run again resumes past that occurrence. Step ignores breakpoints. Reset clears the machine but keeps breakpoints. Compilation clears breakpoints.
6. Turn on constant folding and compile again to compare instruction counts. The original tree remains visible.
7. Download source (.jenga), project (.json), assembly text or output. Open project accepts project JSON or plain source text. The last source/settings are autosaved locally when storage is available. Execution state, breakpoints and trace history are not saved.

The source becomes stale when edited or when the optimisation setting changes. Execution is disabled until a successful compile, so the UI cannot silently execute an old program against changed source.

## Language

This is the **Jenga teaching language**, a small C-like language, not JavaScript, C or Java. It supports integer variables, expressions, assignment, print, if/else and while. Assignment/print require semicolons; branch and loop bodies require braces.

```text
let n = 6;
let result = 1;
while (n > 1) {
  result = result * n;
  n = n - 1;
}
print(result);
```

`let` explicitly declares a variable and cannot redeclare it. A first assignment without `let` also declares the name: `sum = 3 + 5;`. All variables are global, including declarations inside branches/loops. There is no block scope. A read before any textual assignment is a compile error. A read of a variable whose assignment was skipped by control flow is a runtime error. Declaration is a compilation action; executing a let statement in a loop updates the same global slot each time.

Operators, from low to high precedence:

- `||`
- `&&`
- `==`, `!=`
- `<`, `<=`, `>`, `>=`
- `+`, `-`
- `*`, `/`, `%`
- unary `!`, `-`, `+`

Binary operators associate left-to-right within a precedence level. Parentheses override precedence. `&&` and `||` short-circuit, evaluate only the necessary operand and produce 0 or 1. Zero is false, all other integers are true. Comparisons also produce 0 or 1. Comments use `//` or `/* ... */`.

Values are signed 32-bit integers. Arithmetic wraps modulo 2^32 and is interpreted as signed; multiplication uses integer multiplication. Division truncates toward zero, and remainder has the dividend's sign. Division/remainder by zero is a runtime error. Decimal literal range is 0–2147483647; obtain the minimum signed value with `-2147483647 - 1`. Hex display shows the same 32 bits as an unsigned hexadecimal word; it does not change arithmetic.

There are no functions, strings, input, arrays, floating-point values, for loops, ++, recursion, native machine-code generation or operating-system calls.

## Compiler and CPU model

- Lexer: tokenises source with exact source offsets and line/column locations. Whitespace and comments are omitted from the token display.
- Parser: precedence-climbing expressions and recursive-descent statements produce an original syntax tree.
- Compiler: emits stack instructions with source-node/line mappings; resolves global variable slots; patches control-flow jumps.
- Optional constant folding replaces fully constant arithmetic/unary expression trees with one PUSH. Variable reads and possibly failing division are not evaluated by the optimiser. Short-circuit operations retain control flow.
- VM: PUSH, LOAD, STORE, ADD, SUB, MUL, DIV, MOD, NEG, NOT, BOOL, comparisons, JZ, JMP, PRINT and HALT. The actual instruction definitions are in engine.mjs.

This is a **teaching stack machine**, not an emulator of a real Z80, x86 or ARM CPU. It executes the compiler's actual emitted instructions. ACC displays the most recently loaded, stored or calculated value. PC points to the next instruction. The instruction register/description shows the last executed instruction. SP is the current operand-stack depth. RAM holds named variable slots. Control flow is not a fixed animation.

The diagram highlights logical operations and transfers, not physical bus pins, timing, pipeline hazards or hardware clock cycles. The step counter is an instruction count. Stage tabs allow inspecting the same compiled program from different angles. Syntax-tree nodes and tokens locate their exact source span; executing an instruction highlights its mapped tree node when that node is present in the selected tree view. Tree edge order reflects child order (condition then body, then/else in source order); the diagram is an AST rather than a control-flow graph.

## Bounds

Source: 30,000 characters; tokens: 5,000; variables: 64; compiled instructions: 10,000; execution: 100,000 instructions; operand stack: 256 entries; output: 500 integers. Nested or very deep expressions are rejected. AST drawing is limited to 200 nodes at a time; choose a statement in the tree focus selector to inspect a smaller portion. Readable size may require horizontal/vertical scrolling.

Back retains the last 300 machine snapshots. Run uses bounded animation-frame batches so the browser remains responsive. Backgrounding the page pauses execution. Reduced-motion settings stop the decorative moving line dashes; values still update. No source is passed to eval, Function, a native process or a server.

## Verification

`node tests/core.mjs`

57 checks cover all seven built-in programs with and without folding, precedence, signed arithmetic, overflow, short-circuit behaviour, lexer locations, malformed source, uninitialised variables, runtime division errors, prototype-like variable names, reverse stepping, optimisation equivalence for the examples, and runaway/deep-program limits. The compiler is educational software, not an exhaustive conformance implementation of another language.

Browser checks cover compilation, forward/backward stepping, stage switching, a breakpoint, program execution/output and a source error. Responsive layouts are provided; the main browser visual check was desktop Chrome.

## Artwork and licensing

Original code: MIT (LICENSE.txt). The engraved illustration was generated specifically for Compiler Studio. See ASSET-ATTRIBUTION.md for the prompt and asset path. No external source libraries or commercial assets are bundled. The compass/header follows the existing Jenga-Code application design.
