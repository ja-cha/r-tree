import {RTreeEntry} from "./com/abt/RTree";


const entry= new RTreeEntry<String>(0,0,1,1, "Hi!");
//let m =  rTree.getMessage();

let xys:number[] = [1,2,3,4,5];
let curr = 0;
let i = 0;
     if (i + 2 < xys.length)
      curr=  i + 2 
      else curr= 0;
      entry.nearestOption(xys[i], xys[i + 1], 2) 
 
console.log("this is index.ts");
