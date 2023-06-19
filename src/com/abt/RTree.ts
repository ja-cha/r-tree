import { 
  DistanceCalculator, 
  distanceCalculatorImpl, 
  arrayCopy,
  copyOf,
  DejaVuCounter, 
  RTreeEntryBinaryHeap,
  RTreeEntryIndexedSeq,
  AdaptedRTreeEntryIndexedSeq,
  ShiftedRTreeEntryIndexedSeq,
  IndexedSeq,
  StringBuilder} from './RTreeUtils'
import { Comparator, XComparator, YComparator } from './RTreeComparators'


interface RTreeIface<A> {
  getMinX: () => number;
  getMinY: () => number;
  getMaxX: () => number;
  getMaxY: () => number;
  isEmpty: () => boolean;

  nearest: (x: number, y: number, maxDist: number) => (f: (n: number, rt: RTreeEntry<A>) => number) => (distCalc: DistanceCalculator) => number;
  
  nearestOption: (x: number, y: number, maxDist: number) => (distCalc: DistanceCalculator) => RTreeEntry<A>|null;
   
  nearestK: (x: number, y: number, k: number, maxDist?: number) => (distCalc: DistanceCalculator) => IndexedSeq<RTreeEntry<A>>;

  searchByPoint: (x: number, y: number) => (f: (e:RTreeEntry<A>) => void) => void;

  searchAllByPoint: (x: number, y: number) => IndexedSeq<RTreeEntry<A>>;
 
  searchByRectangle: (minX: number, minY: number, maxX: number, maxY: number) => (f: (e:RTreeEntry<A>) => void) => void;

  searchAllByRectangle: (minX: number, minY: number, maxX: number, maxY: number) => IndexedSeq<RTreeEntry<A>>;

  pretty: (sb: StringBuilder, indent: number)=> StringBuilder;

  entries: ()=>IndexedSeq<RTreeEntry<A>>;

}

class RTree<A>  {

  build = (entries: RTreeEntry<A>[], nodeCapacity: number = 2): RTreeIface<A> => {
    if (nodeCapacity <= 1) throw new Error("nodeCapacity should be greater than 1")
    return this.pack(entries, nodeCapacity, new XComparator<A>, new YComparator<A>);
  };

  update =(rtree: RTreeIface<A>, remove: RTreeEntry<A>[], insert: RTreeEntry<A>[], nodeCapacity: number = 2): RTreeIface<A> =>{
    if ((rtree.isEmpty() || remove.length == 0) && insert.length == 0) 
      return rtree;
    else if (rtree.isEmpty() && remove.length == 0) {
      return this.pack(insert, nodeCapacity, new XComparator<A>, new YComparator<A>)
    } else if (remove.length == 0) {
      let es1 = this.lastLevel(rtree)
      let es  =  es1.concat(insert);
      return this.pack(es, nodeCapacity, new XComparator<A>, new YComparator<A>)
    } else {
      let cs = remove.reduce((map, obj, i) => {
        if(!map.get(obj)){
          let d = new DejaVuCounter();
          d.inc();
          map.set(obj, d);
        }        
        return map;
      }, new Map<RTreeIface<A>, DejaVuCounter>());
      
      let es1 = this.lastLevel(rtree)
      let l1 = es1.length
      let es  =  es1.concat(insert);
      var i = 0
      let n = insert.length;
        
      while (i < l1) {
        let e = es1[i];
        
        let optC = cs.get(e);
        if (!optC || optC.decIfPositive()) {
          es[n] = e
          n += 1
        }
        i += 1
      }
      
      return this.pack((es.length == n)? es: copyOf(es, n), nodeCapacity, new XComparator<A>, new YComparator<A>);
   
    }
  };

  pack = (nodes: RTreeIface<A>[], nodeCapacity: number, xComp: Comparator<RTreeIface<A>>, yComp: Comparator<RTreeIface<A>>): RTreeIface<A> => {

    let l = nodes.length
    if (l == 0)
      return new RTreeNil
    else if (l == 1)
      return nodes[0];
    else if (l <= nodeCapacity)
      return this.packNode(nodes, 0, l);
    else {
      this.sort(nodes, 0, l, xComp);
      let nodeCount = Math.ceil(l / nodeCapacity);
      let sliceCapacity = Math.ceil(Math.sqrt(nodeCount)) * nodeCapacity
     
      let nextLevelNodes:RTreeIface<A>[] = Array.from<RTreeIface<A>>({ length: nodeCount });
      let i: number = 0;
      let j: number = 0;

      do {
        let sliceTo = Math.min(i + sliceCapacity, l)
        this.sort(nodes, i, sliceTo, yComp);
        do {
          let packTo = Math.min(i + nodeCapacity, sliceTo)
          nextLevelNodes[j] = this.packNode(nodes, i, packTo)
          i = packTo
          j += 1
        } while (i < sliceTo)
      } while (i < l)
      return this.pack(nextLevelNodes, nodeCapacity, xComp, yComp)
    }

  };

  packNode = (entries: RTreeIface<A>[], from: number, to: number): RTreeNode<A> => {
    var t = entries[from];
    var i: number = from + 1;
    var minY = t.getMinY();
    var maxY = t.getMaxY();
    var minX = t.getMinX();
    var maxX = t.getMaxX();
    while (i < to) {
      t = entries[i];
      i += 1
      minY = this.min(t.getMinY(), minY)
      maxY = this.max(t.getMaxY(), maxY)
      minX = this.min(t.getMinX(), minX)
      maxX = this.max(t.getMaxX(), maxX)
    }
    return new RTreeNode<A>(minX, minY, maxX, maxY, entries, from, to);

  };
  
  lastLevel = (t: RTreeIface<A>): RTreeIface<A>[] => {
    if(t instanceof RTreeNode<A>){
      let n = t.level[0];
      if(n instanceof RTreeEntry<A>){
        return t.level;
      }else{
         return this.lastLevel(n);
      }       
    }else if(t instanceof RTreeEntry<A>){
      return [t];
    }else{
     return [];
    }
  };
  
  static appendSpaces = (sb: StringBuilder, n: number):StringBuilder =>{
    if (n > 0) 
    return this.appendSpaces(sb.append('\t'), n - 1);
    else 
    return sb;
  };

  private countRunAndMakeAscending = (a: RTreeIface<A>[], lo: number, hi: number, c: Comparator<RTreeIface<A>>) => {
    if (!(lo < hi)) throw new Error("Runtime Error:assertion failed.");
    let runHi = lo + 1;
    if (runHi == hi)
      return 1;

    // Find end of run, and reverse range if descending
    if (c.compare(a[runHi++], a[lo]) < 0) { // Descending
      while (runHi < hi && (c.compare(a[runHi], a[runHi - 1]) < 0))
        runHi++;
      this.reverseRange(a, lo, runHi);
    } else {                              // Ascending
      while (runHi < hi && (c.compare(a[runHi], a[runHi - 1]) >= 0))
        runHi++;
    }

    return runHi - lo;
  };
  
  private sort = (a: RTreeIface<A>[], lo: number, hi: number, c: Comparator<RTreeIface<A>>) => {
    let initRunLen = this.countRunAndMakeAscending(a, lo, hi, c);
    this.innerSort(a, lo, hi, lo + initRunLen, c);
  };

  private innerSort = (a: RTreeIface<A>[], lo: number, hi: number, start: number, c: Comparator<RTreeIface<A>>) => {
    if (!(lo <= start && start <= hi)) {
      throw new Error("Runtime Error:assertion failed.");
    }
    if (start == lo)
      start++;
    for (; start < hi; start++) {
      let pivot: RTreeIface<A> = a[start];

      // Set left (and right) to the index where a[start] (pivot) belongs
      let left = lo;
      let right = start;
      if (!(left <= right)) {
        throw new Error("Runtime Error:assertion failed.");
      }
      /*
       * Invariants:
       *   pivot >= all in [lo, left).
       *   pivot <  all in [right, start).
       */
      while (left < right) {
        let mid = (left + right) >>> 1;

        if (c.compare(pivot, a[mid]) < 0)
          right = mid;
        else
          left = mid + 1;
      }

      if (!(left == right)) {
        throw new Error("Runtime Error:assertion failed.");
      }

      /*
       * The invariants still hold: pivot >= all in [lo, left) and
       * pivot < all in [left, start), so pivot belongs at left.  Note
       * that if there are elements equal to pivot, left points to the
       * first slot after them -- that's why this sort is stable.
       * Slide elements over to make room for pivot.
       */
      let n = start - left;  // The number of elements to move
      // Switch is just an optimization for arraycopy in default case
      switch (n) {
        case 2: a[left + 2] = a[left + 1];
        case 1: a[left + 1] = a[left];
          break;
        default: arrayCopy(a, left, a, left + 1, n);
      }
      a[left] = pivot;
    }
  };

  private reverseRange = (a: RTreeIface<A>[], lo: number, hi: number) => {
    hi--;
    while (lo < hi) {
      let t = a[lo];
      a[lo++] = a[hi];
      a[hi--] = t;
    }
  };

  private min = (x: number, y: number) => {
    if (x < y)
        return x;
      else
        return y;
  };
  
  private max = (x: number, y: number) => {
    if (x < y)
      return y;
    else
      return x;
  };

}

class RTreeEntry<A> extends RTree<A> implements RTreeIface<A>{

   minX: number;
   minY: number;
   maxX: number;
   maxY: number;
   value: A;

  constructor(minX: number, minY: number, maxX: number, maxY: number, value: A) {
    super();
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    
    this.value = value;
  }

  getMinX = () => this.minX;

  getMinY = () => this.minY;

  getMaxX = () => this.maxX;

  getMaxY = () => this.maxY;

  isEmpty = () => false;
 
  nearest = (x: number, y: number, maxDist: number = Number.POSITIVE_INFINITY) =>
    (f: (n: number, rt: RTreeEntry<A>) => number) =>
      (distCalc: DistanceCalculator): number => {
        const dist = distCalc.distance(x, y, this);
        if (dist < maxDist)
          return f(dist, this)
        else
          return maxDist;
  };

  nearestOption = (x: number, y: number, maxDist: number = Number.POSITIVE_INFINITY) => (distCalc: DistanceCalculator): RTreeEntry<A>|null => {
    let entry: RTreeEntry<A>|null = null
    this.nearest(x, y, maxDist)((calc, ent) => {
      entry = ent
      return calc
    })(distCalc) 
    return entry
  }

  nearestK = (x: number, y: number, k: number, maxDist: number  = Number.POSITIVE_INFINITY) => (distCalc: DistanceCalculator): IndexedSeq<RTreeEntry<A>> => {
    if (k <= 0) 
      return new ShiftedRTreeEntryIndexedSeq([], 0);
    else {
        let heap  = new RTreeEntryBinaryHeap<A>(maxDist, k)  
        this.nearest(x, y, maxDist)((d, e) =>{ 
          return heap.put(d, e);          
        })(distanceCalculatorImpl) 
               
        return heap.toIndexedSeq();      
          
     }
  }

  searchByPoint = (x: number, y: number)=>(f:(e:RTreeEntry<A>)=>void)=>{
    if (this.minY <= y && y <= this.maxY && this.minX <= x && x <= this.maxX) {
      f(this);
    }
  }

  searchAllByPoint = (x: number, y: number):IndexedSeq<RTreeEntry<A>>=> {
    let size: number = 0;
    let array: RTreeEntry<A>[] = Array.from<RTreeEntry<A>>({ length: 16 });
    this.searchByPoint(x, y)((v) =>{
      if (size + 1 >= array.length) array = copyOf(array, size << 1)
      array[size] = v
      size += 1
    })
   return  new RTreeEntryIndexedSeq<A>(array, size)
  }

  searchByRectangle = (minX: number, minY: number, maxX: number, maxY: number)=>(f: (E:RTreeEntry<A>) => void) =>{
    if (this.minY <= maxY && minY <= this.maxY && this.minX <= maxX && minX <= this.maxX) {
     return f(this)
    }
  }

  searchAllByRectangle = (minX: number, minY: number, maxX: number, maxY: number):IndexedSeq<RTreeEntry<A>>=> {
    let size: number = 0;
    let array: RTreeEntry<A>[] = Array.from<RTreeEntry<A>>({ length: 16 });
    this.searchByRectangle(minX, minY, maxX, maxY)((v) =>{
      if (size + 1 >= array.length) array = copyOf(array, size << 1)
      array[size] = v
      size += 1
    })
   return  new RTreeEntryIndexedSeq<A>(array, size);
  }

  entries = ():IndexedSeq<RTreeEntry<A>> =>{    
      return new AdaptedRTreeEntryIndexedSeq<A>(this.lastLevel(this));  
  } 

  pretty = (sb: StringBuilder, indent: number)=> {
      RTree.appendSpaces(sb, indent)
     .append("RTreeEntry(")
     .append(`${this.minX}`)
     .append(',')
     .append(`${this.minY}`)
     .append(',')
     .append(`${this.maxX}`)
     .append(',')
     .append(`${this.maxY}`)
     .append(',')
     .append(`${this.value}`)
     .append(")\n");

    return sb;
  };
      
  toString =():String => {
    return this.pretty(new StringBuilder(), 0).build();
  }
}

class RTreeNode<A>  extends RTree<A> implements RTreeIface<A> {

  private minX: number;
  private minY: number;
  private maxX: number;
  private maxY: number;
  private from: number;
  private to: number;
  level: RTreeIface<A>[];

  constructor(minX: number, minY: number, maxX: number, maxY: number, level: RTreeIface<A>[], from: number, to: number) {
    super();
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;

    this.from = from;
    this.to = to;

    this.level = level;
  }

  getMinX = () => this.minX;

  getMinY = () => this.minY;

  getMaxX = () => this.maxX;

  getMaxY = () => this.maxY;

  isEmpty = () => false;
  
  nearest = (x: number, y: number, maxDist: number = Number.POSITIVE_INFINITY) =>
    (f: (n: number, rt: RTreeEntry<A>) => number) =>
      (distCalc: DistanceCalculator): number => {
        let minDist = maxDist
        let n = this.to - this.from;
        var i = 0;
        if (this.level[this.from] instanceof RTreeEntry<A>) {
          while (i < n) {
            const e = <RTreeEntry<A>>this.level[this.from + i];
            const d = distCalc.distance(x, y, e);
            if (d < minDist){
               minDist = f(d, e);
            }
            i += 1;
          }
        } else {
          const ps: number[] = [... new Array(n)].fill(0);
          while (i < n) {
            let n = distCalc.distance(x, y, this.level[this.from + i]);
            ps[i] = (Math.trunc( n ) * Math.pow(2, 32)) + i ;
            i += 1;
          }
          ps.sort(); // Assuming that there no NaNs or negative values for distances
          i = 0
          while (i < n && (ps[i] / Math.pow(2, 32))  < minDist) {
            minDist = this.level[this.from + ps[i] & 0x7fffffff].nearest(x, y, minDist)(f)(distanceCalculatorImpl);
            i += 1;
          }
        }
        return minDist;
  }

  nearestOption = (x: number, y: number, maxDist: number = Number.POSITIVE_INFINITY) =>  (distCalc: DistanceCalculator): RTreeEntry<A>|null => {
    let entry: RTreeEntry<A>|null = null
    this.nearest(x, y, maxDist)((calc, ent) => {
      entry = ent
      return calc
    })(distCalc)
    return entry
  }

  nearestK = (x: number, y: number, k: number, maxDist: number  = Number.POSITIVE_INFINITY) => (distCalc: DistanceCalculator):IndexedSeq<RTreeEntry<A>> => {
    if (k <= 0) 
      return new ShiftedRTreeEntryIndexedSeq([], 0);
    else {
      let heap  = new RTreeEntryBinaryHeap<A>(maxDist, k)  
      this.nearest(x, y, maxDist)((d, e) =>{ 
          return heap.put(d, e);          
        })(distanceCalculatorImpl) 

        return heap.toIndexedSeq();      
      }
  }

  searchByPoint = (x:number, y:number)=>(f: (e:RTreeEntry<A>) => void)=>{
    if (this.minY <= y && y <= this.maxY && this.minX <= x && x <= this.maxX) {
      var i = this.from
      while (i < this.to) {
        this.level[i].searchByPoint(x, y)(f)
        i += 1
      }
    }
  }

  searchByRectangle = (minX: number, minY: number, maxX: number, maxY: number)=>(f: (e:RTreeEntry<A>) => void) =>{
    if (this.minY <= maxY && minY <= this.maxY && this.minX <= maxX && minX <= this.maxX) {
      var i = this.from
      while (i < this.to) {
        this.level[i].searchByRectangle(minX, minY, maxX, maxY)(f)
        i += 1
      }
    }
  }

  searchAllByPoint = (x: number, y: number)=> {
    let size: number = 0;
    let array: RTreeEntry<A>[] = Array.from<RTreeEntry<A>>({ length: 16 });
    this.searchByPoint(x, y)((v) =>{
      if (size + 1 >= array.length) array = copyOf(array, size << 1)
      array[size] = v
      size += 1
    })
   return  new RTreeEntryIndexedSeq<A>(array, size)
  }
  
  searchAllByRectangle = (minX: number, minY: number, maxX: number, maxY: number):IndexedSeq<RTreeEntry<A>>=> {
    let size: number = 0;
    let array: RTreeEntry<A>[] = Array.from<RTreeEntry<A>>({ length: 16 });
    this.searchByRectangle(minX, minY, maxX, maxY)((v) =>{
      if (size + 1 >= array.length) array = copyOf(array, size << 1)
      array[size] = v
      size += 1
    })
   return  new RTreeEntryIndexedSeq<A>(array, size);
  }
  
  entries = ():IndexedSeq<RTreeEntry<A>>  =>{       
      return new AdaptedRTreeEntryIndexedSeq<A>(this.lastLevel(this));        
  } 

  pretty = (sb: StringBuilder, indent: number)=> {
     RTree.appendSpaces(sb, indent)
    .append("RTreeNode(")
    .append(`${this.minX}`)
    .append(',')
    .append(`${this.minY}`)
    .append(',')
    .append(`${this.maxX}`)
    .append(',')
    .append(`${this.maxY}`)
    .append(")\n");

    var i = this.from;
   
    while (i < this.to) {
      this.level[i].pretty( sb, indent + 1);
      i += 1
    }
    return sb;
  }
  toString =():String => {
    return this.pretty(new StringBuilder(), 0).build();
  }
}

class RTreeNil<A>  extends RTree<A> implements RTreeIface<A> {
 
  getMinX = () => { throw new Error("RTreeNil.minX");}
  
  getMinY = () => { throw new Error("RTreeNil.minY");}
  
  getMaxX = () => { throw new Error("RTreeNil.maxX");}
  
  getMaxY = () => { throw new Error("RTreeNil.maxY");}

  isEmpty = () => true;

  nearest = (x: number, y: number, maxDist: number = Number.POSITIVE_INFINITY) =>
    (f: (n: number, rt: RTreeEntry<A>) => number) =>
      (distCalc: DistanceCalculator): number => {
        return maxDist
      }

  nearestOption = (x: number, y: number, maxDist: number = Number.POSITIVE_INFINITY) =>  (distCalc: DistanceCalculator): RTreeEntry<A>|null => {
    let entry: RTreeEntry<A>|null = null
    this.nearest(x, y, maxDist)((calc, ent) => {
      entry = ent
      return calc
    })(distCalc)
    return entry
  }
  
  nearestK = (x: number, y: number, k: number, maxDist: number  = Number.POSITIVE_INFINITY) => (distCalc: DistanceCalculator):IndexedSeq<RTreeEntry<A>> => {
    if (k <= 0) 
      return  new ShiftedRTreeEntryIndexedSeq<A>([],0);
    else {
        let heap  = new RTreeEntryBinaryHeap<A>(maxDist, k)  
        this.nearest(x, y, maxDist)((d, e) =>{ 
          return heap.put(d, e);          
        })(distanceCalculatorImpl) 
               
        return heap.toIndexedSeq();      
      
      }
  }      

  searchByPoint = (x: number, y: number) => (f: (e:RTreeEntry<A>) => void) => {}

  searchAllByPoint = (x: number, y: number)=> {
    let size: number = 0;
    let array: RTreeEntry<A>[] = Array.from<RTreeEntry<A>>({ length: 16 });
    this.searchByPoint(x, y)((v) =>{
      if (size + 1 >= array.length) array = copyOf(array, size << 1)
      array[size] = v
      size += 1
    })
   return  new RTreeEntryIndexedSeq<A>(array, size)
  }
  
  searchByRectangle = (minX: number, minY: number, maxX: number, maxY: number) => (f: (e:RTreeEntry<A>) => void) => {}

  searchAllByRectangle = (minX: number, minY: number, maxX: number, maxY: number):IndexedSeq<RTreeEntry<A>>=> {
    let size: number = 0;
    let array: RTreeEntry<A>[] = Array.from<RTreeEntry<A>>({ length: 16 });
    this.searchByRectangle(minX, minY, maxX, maxY)((v) =>{
      if (size + 1 >= array.length) array = copyOf(array, size << 1)
      array[size] = v
      size += 1
    })
   return  new RTreeEntryIndexedSeq<A>(array, size);
  }

  entries = ():IndexedSeq<RTreeEntry<A>>  =>{       
    return new AdaptedRTreeEntryIndexedSeq<A>(this.lastLevel(this));          
  } 

  pretty = (sb: StringBuilder, indent: number)=> {
     return RTree.appendSpaces(sb, indent).append("RTreeNil()\n");
  }

  toString =():String => {
    return this.pretty(new StringBuilder(), 0).build();
  }
}

export { RTree, RTreeIface, RTreeEntry, RTreeNode, RTreeNil }

// MIXIN TEST 
// type Class <T> = new (...args:any []) => T;
 
// function RTreeIfaceMixIn<A, TBase extends  Class<RTreeIface<A>>> (base: TBase) {
//   return class extends base {
//     nearestK = (x: number, y: number, k: number, maxDist: number  = Number.POSITIVE_INFINITY) => (distCalc: DistanceCalculator):IndexedSeq<RTreeEntry<A>> => {
//       if (k <= 0) 
//         return new ShiftedRTreeEntryIndexedSeq([], 0);
//       else {
//         let heap  = new RTreeEntryBinaryHeap<A>(maxDist, k)  
//         this.nearest(x, y, maxDist)((d, e) => heap.put(d, e))(distanceCalculatorImpl)        
//           return heap.toIndexedSeq();
        
//         }
//     }
//     searchAllByPoint = (x: number, y: number)=> {
//       let size: number = 0;
//       let array = Array.from<RTreeEntry<A>>({ length: 16 });
//       this.searchByPoint(x, y)((v) =>{
//         if (size + 1 >= array.length) array = copyOf(array, size << 1)
//         array[size] = v
//         size += 1
//       })
//      return  new RTreeEntryIndexedSeq<A>(array, size)
//     }
//     searchAllByRectangle = (minX: number, minY: number, maxX: number, maxY: number):IndexedSeq<RTreeEntry<A>>=> {
//       let size: number = 0;
//       let array: RTreeEntry<A>[] = Array.from<RTreeEntry<A>>({ length: 16 });
//       this.searchByRectangle(minX, minY, maxX, maxY)((v) =>{
//         if (size + 1 >= array.length) array = copyOf(array, size << 1)
//         array[size] =  v
//         size += 1
//       })
//      return  new RTreeEntryIndexedSeq<A>(array, size);
//     }  
//   };
// }
// const valueTypeA = RTreeIfaceMixIn(class < RTreeEntry|RTreeNode|RTreeNil class declaration  here>);
// type classTypeA = InstanceType<typeof valueTypeA>;

 