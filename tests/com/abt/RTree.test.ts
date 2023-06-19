import { RTree, RTreeEntry  } from "../../../src/com/abt/RTree";
import {
  mkRectangleEntry,
  distanceCalculatorImpl,
  RTreeEntryIndexedSeq,
} from '../../../src/com/abt/RTreeUtils'

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
const mkIndex: (u: number) => number[] = (until: number) => {
  let i = Array.from<number>({ length: until });
  return i.map((_, n) => n);
}

const mkPoints: (s: number) => Point[] = (size: number) => {
  let l = Math.sqrt(size);
  let li = l;
  return mkIndex(size).map(i => {
    let x = (i / li) / l
    let y = (i % li) / l
    return new Point(x, y);
  });

}

const doShuffle: <A>(a: A[]) => A[] = <A>(data: A[]) => {

  const clone: A[] = [];

  data.forEach(item => clone.push( item));

  const getRandomInt: (mi: number, ma: number) => number = (min: number, max: number) => {
    let min_ = Math.ceil(min);
    let max_ = Math.floor(max);
    return Math.floor(Math.random() * (max_ - min_ + 1)) + min_;
  }


  var i = clone.length - 1;
  while (i > 0) {
    let i1 = getRandomInt(0, i);
    let a = clone[i1];
    clone[i1] = clone[i];
    clone[i] = a;
    i -= 1;
  }

  return clone;
}

// build entries, values are of type number
const buildEntries = (size: number): RTreeEntry<number>[] => {
  let indexes: number[] = mkIndex(size);
  //let shuffled:number[] = doShuffle(indexes);  
  let entries: RTreeEntry<number>[] = indexes.map((_, n) => {
    return mkRectangleEntry(n, n, n + 1, n + 1, n);
  });
  return entries;
}

describe('RTree Tests', () => {
  test('RTree.build #1', () => {
 
    // build with Numbers
    const size = 5;

    let indexes: number[] = mkIndex(size);

    let orderedEntries: RTreeEntry<number>[] = indexes.map((_, n) => {
      return mkRectangleEntry(n, n, n + 1, n + 1, n*10);
    });

    //let entries = doShuffle(orderedEntries);
    let entries = orderedEntries;

    let tree = new RTree<number>().build(entries);
    let received = tree.entries();
    let expected = entries;

    console.info(tree.toString())

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.build #2', () => {
    // build with Points
    const size = 5;

    let points: Point[] = doShuffle(mkPoints(size));

    let entries: RTreeEntry<Point>[] = mkIndex(size).map((_, n) => {
      return mkRectangleEntry(n, n, n + 1, n + 1, points[n]);
    });

    let tree = new RTree<Point>().build(entries);
    let received = tree.entries();
    let expected = entries;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.build#nodeCapacity(1) #1', () => {
    const t = () => {
      let entries = buildEntries(10);

      let received = new RTree<number>().build(entries, 1).entries();
    };
    expect(t).toThrow("nodeCapacity should be greater than 1");
  });
  test('RTree.build#nodeCapacity(2) #2', () => {
    let entries = buildEntries(10);

    let received = new RTree<number>().build(entries, 2).entries();
    let expected = entries;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.build#nodeCapacity(4) #3', () => {
    let entries = buildEntries(10);

    let received = new RTree<number>().build(entries, 4).entries();
    let expected = entries;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.build#nodeCapacity(8) #4', () => {

    let entries = buildEntries(10);

    let received = new RTree<number>().build(entries, 8).entries();
    let expected = entries;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.entries #1', () => {
    let entries = buildEntries(10);

    let received = new RTree<number>().build(entries).entries();
    let expected = entries;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.entries #2', () => {
    const t = () => {
      let entries = buildEntries(10);
      new RTree<number>().build(entries).entries().get(-1);
    };
    expect(t).toThrow("-1");
  });
  test('RTree.entries #3', () => {
    const t = () => {
      let entries = buildEntries(10);
      new RTree<number>().build(entries).entries().get(entries.length);
    };
    expect(t).toThrow("10");
  });
  test('RTree.nearestK #1', () => {

    let entries = buildEntries(100);

    let received = new RTree<number>().build(entries).nearestK(0, 0, 1)(distanceCalculatorImpl);
    let expected = new RTreeEntryIndexedSeq<number>([entries[0]], 1);



    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.nearestK #2', () => {

    let entries = buildEntries(100);

    let received = new RTree<number>().build(entries).nearestK(100, 100, 1)(distanceCalculatorImpl);

    let expected = new RTreeEntryIndexedSeq<number>([entries[entries.length - 1]], 1);

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.nearestK(3) #3', () => {

    let entries = buildEntries(100);

    let rTree = new RTree<number>().build(entries)
    let received = rTree.nearestK(0, 0, 3)(distanceCalculatorImpl);
    let expected = new RTreeEntryIndexedSeq<number>([
      mkRectangleEntry(2, 2, 3, 3, 2),
      mkRectangleEntry(0, 0, 1, 1, 0),
      mkRectangleEntry(1, 1, 2, 2, 1)], 3);

    console.log(received.toString());
    console.log(expected.toString());

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.nearestK(7) #4', () => {

    let entries = buildEntries(100);

    let rTree = new RTree<number>().build(entries)
    let received = rTree.nearestK(0, 0, 7)(distanceCalculatorImpl);
    console.log(received.toString());

    let expected = new RTreeEntryIndexedSeq<number>([
      mkRectangleEntry(6, 6, 7, 7, 6),
      mkRectangleEntry(3, 3, 4, 4, 3),
      mkRectangleEntry(5, 5, 6, 6, 5),
      mkRectangleEntry(0, 0, 1, 1, 0),
      mkRectangleEntry(2, 2, 3, 3, 2),
      mkRectangleEntry(1, 1, 2, 2, 1),
      mkRectangleEntry(4, 4, 5, 5, 4)], 7);

    console.log(received.toString());
    console.log(expected.toString());

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.nearestK(-1) #4', () => {
    const t = () => {
      let entries = buildEntries(100);
       new RTree<number>().build(entries).nearestK(0, 0, 7)(distanceCalculatorImpl).get(-1);
    };
    expect(t).toThrow("-1");
  });
  test('RTree.nearestK(7) #5', () => {
    const t = () => {
      let entries = buildEntries(100);
       new RTree<number>().build(entries).nearestK(0, 0, 7)(distanceCalculatorImpl).get(7);
    };
    expect(t).toThrow("7");
  });
  test('RTree.update #1', () => {

    let entries = buildEntries(100);
    let entries1 = entries.slice(0, entries.length/2);
    let entries2 = entries.slice(entries.length/2, entries.length);

    let TREE = new RTree<number>();
    let original = TREE.build(entries1);
    let updated = TREE.update(original, [], entries2); 
    
    console.log(original.toString());
    console.log("-----------------");
    console.log(updated.toString());
   
    let received = updated.entries().length; 
    let expected =  100
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.update #2', () => {

    let entries = buildEntries(3);
     
    let TREE = new RTree<number>();
    let original = TREE.build(entries, 2);
    let updated = TREE.update(original, [], original.entries(), 2);
   
    console.log(original.toString());
    console.log("-----------------");
    console.log(updated.toString());
    
    let received =  updated.entries().length; 
    let expected =  6
    
 
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.update #3', () => {

    let entries = buildEntries(3);
     
    let TREE = new RTree<number>();
    let original = TREE.build([], 2);
    let updated = TREE.update(original, [], entries, 2);
   
    console.log(original.toString());
    console.log("-----------------");
    console.log(updated.toString());
    
    let received =  updated.entries().length; 
    let expected =  3
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.update #4', () => {

    let entries = buildEntries(5);
    let entries1 = entries.slice(0, entries.length/2);
 
    let TREE = new RTree<number>();
    let original = TREE.build(entries);
    let updated = TREE.update(original, entries1, entries1);
    
    console.log(original.toString());
    console.log("-----------------");
    console.log(updated.toString());
   
  
    let received = updated.entries().length; 
    let expected =  5
  
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.update #5', () => {

    let entries = buildEntries(5);
    let entries1 = entries.slice(0, entries.length/2);
 
    let TREE = new RTree<number>();
    let original = TREE.build(entries);
    let updated = TREE.update(original, entries1, []);
    
    console.log(original.toString());
    console.log("-----------------");
    console.log(updated.toString());
   
  
    let received = updated.entries().length; 
    let expected =  3
  
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.update #6', () => {

    let entries = buildEntries(3);
    let entries1 = entries.slice(0, entries.length/2);
 
    let TREE = new RTree<number>();
    let original = TREE.build(entries,2);
    let updated =  TREE.update(TREE.update(original, [], entries1, 2), entries1, [], 2);
    
    console.log(original.toString());
    console.log("-----------------");
    console.log(updated.toString());
   
  
    let received = updated.entries().length; 
    let expected =  3
  
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.searchAllByPoint #1', () => {

    let entries = buildEntries(100);
     
    let points = new RTree<number>().build(entries,2).searchAllByPoint(50,50);
    let received =  points.map(entry=> entry.value);
    let expected = [49,50];
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.searchAllByPoint #2', () => {

    let entries = buildEntries(100);
    
      const t = () => {
       let result =  new RTree<number>().build(entries,2).searchAllByPoint(50,50);
       result.get(-1);
      };
      expect(t).toThrow("-1");
  });
  test('RTree.searchAllByPoint #3', () => {

    let entries = buildEntries(100);
    
      const t = () => {
        let result = new RTree<number>().build(entries,2).searchAllByPoint(50,50);
        result.get(2);
      };
      expect(t).toThrow("2");
  });
  test('RTree.searchByPoint #1', () => {

    let entries = buildEntries(100);
     
    let received:any[] = [];
    let thenApply = new RTree<number>().build(entries,2).searchByPoint(50,50);
    thenApply((found)=>{received.push(found.value)});
    
    let expected = [49,50];
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.searchAllByRectangle #1', () => {

    let entries = buildEntries(100);
     
    let received = new RTree<number>().build(entries,2).searchAllByRectangle(50,50,51,51).map(entry=> entry.value);
    let expected = [49,50,51];
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.searchAllByRectangle #2', () => {

    let entries = buildEntries(100);
    
      const t = () => {
       let result =  new RTree<number>().build(entries,2).searchAllByRectangle(50,50,51,51);
       result.get(-1);
      };
      expect(t).toThrow("-1");
  });
  test('RTree.searchAllByRectangle #3', () => {

    let entries = buildEntries(100);
    
      const t = () => {
        let result = new RTree<number>().build(entries,2).searchAllByRectangle(50,50,51,51);
        result.get(3);
      };
      expect(t).toThrow("3");
  });
  test('RTree.searchByRectangle #1', () => {

    let entries = buildEntries(100);
     
    let received:any[] = [];
    let thenApply = new RTree<number>().build(entries,2).searchByRectangle(50,50,51,51);
    thenApply((found)=>{received.push(found.value)});
    
    let expected = [49,50,51];
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.toString #1', () => {

    let entries = buildEntries(100);
     
    let received:string= new RTree<number>().build([]).toString();
    let expected = "RTreeNil()\n";
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.toString #2', () => {

    let entries: RTreeEntry<number>[] = buildEntries(100);
     
    let received:string= new RTree<number>().build([entries[0]]).toString();
    let expected = "RTreeEntry(0,0,1,1,0)\n";
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)

    expect(receivedItem).toBe(asExpected);

  });
  test('RTree.toString #3', () => {

    let entries: RTreeEntry<number>[] = buildEntries(100);
     
    let received:string= new RTree<number>().build(entries.slice(0,2)).toString();
    let expected = "RTreeNode(0,0,2,2)\n\tRTreeEntry(0,0,1,1,0)\n\tRTreeEntry(1,1,2,2,1)\n";
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem = JSON.stringify(received)
    let asExpected = JSON.stringify(expected)
 
    expect(receivedItem).toBe(asExpected);

  });
  
});


