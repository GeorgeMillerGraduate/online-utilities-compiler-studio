import assert from 'node:assert/strict';import{compile,Machine,examples,tokenize}from'../engine.mjs';let checks=0;
function execute(source,optimize=false){const p=compile(source,{optimize}),m=new Machine(p);while(!m.halted&&!m.error)m.step();return{p,m}}
for(const optimize of[false,true]){for(const [i,expected]of[[0,[13]],[1,[1,2,3,4,5]],[2,[720]],[3,[1]],[4,[0,1,1,2,3,5,8,13,21,34]],[5,[6]],[6,[0]]]){const{m}=execute(examples[i].source,optimize);assert.equal(m.error,null);assert.deepEqual(m.output,expected);checks++}}
for(const [expression,want]of[['2+3*4',14],['(2+3)*4',20],['10-3-2',5],['-7/2',-3],['-7%2',-1],['!0',1],['!!12',1],['3<4==1',1],['1||10/0',1],['0&&10/0',0],['0||2&&3',1],['2147483647+1',-2147483648],['65536*65536',0]])for(const opt of[false,true]){assert.deepEqual(execute('print('+expression+');',opt).m.output,[want]);checks++}
for(const src of['print(x);','let x = ;','while(1){','let x=1; let x=2;','print(1)','#','/* bad']){assert.throws(()=>compile(src));checks++}assert.equal(tokenize('// hi\nlet a=2;')[0].line,2);checks++;
for(const optimize of[false,true]){assert.match(execute('print(4/0);',optimize).m.error,/Division by zero/);checks++}
const uninit=execute('if(0){x=2;}print(x);').m;assert.match(uninit.error,/uninitialised/);checks++;
const folded=compile('sum=3+5*2;print(sum);',{optimize:true}),plain=compile('sum=3+5*2;print(sum);');assert.ok(folded.code.length<plain.code.length);checks++;
const {m}=execute('a=3;print(a);');const before=m.snapshot();assert.ok(m.back());m.step();assert.deepEqual(m.snapshot(),before);checks++;
const branch=execute('x=1;if(x){y=7;}else{y=9;}print(y);').m;assert.deepEqual(branch.output,[7]);checks++;
const safe=execute('constructor=3;__proto__=4;print(constructor+__proto__);').m;assert.deepEqual(safe.output,[7]);checks++;
const infinite=execute('while(1){}').m;assert.match(infinite.error,/Instruction limit/);checks++;
assert.throws(()=>compile('x='+ '1+'.repeat(200)+'1;'),/deep/);checks++;
console.log(checks+' compiler/VM checks passed.');
