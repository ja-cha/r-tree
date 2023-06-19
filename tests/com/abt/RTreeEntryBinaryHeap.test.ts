import { RTree, RTreeEntry, RTreeIface, RTreeNil } from "../../../src/com/abt/RTree";
import {
  IndexedSeq,
  RTreeEntryBinaryHeap,
  ShiftedRTreeEntryIndexedSeq,
  mkPointEntry
} from '../../../src/com/abt/RTreeUtils'


describe('RTreeEntryBinaryHeap Tests', () => {
  test('RTreeEntryBinaryHeap.put #1', () => {

    let heap =  new RTreeEntryBinaryHeap<number>(Number.POSITIVE_INFINITY, 1);
    expect(heap.put(2, mkPointEntry(0,0,2))).toBe(2);
    expect(heap.put(1, mkPointEntry(0,0,1))).toBe(1);
    
    heap =  new RTreeEntryBinaryHeap<number>(Number.POSITIVE_INFINITY, 2);
    expect(heap.put(2, mkPointEntry(0,0,2))).toBe(Number.POSITIVE_INFINITY);
    expect(heap.put(1, mkPointEntry(0,0,1))).toBe(2);
   
    heap =  new RTreeEntryBinaryHeap<number>(Number.POSITIVE_INFINITY, 2);
    expect(heap.put(3, mkPointEntry(0,0,3))).toBe(Number.POSITIVE_INFINITY);
    expect(heap.put(2, mkPointEntry(0,0,2))).toBe(3);
    expect(heap.put(1, mkPointEntry(0,0,1))).toBe(2);

  });

  test('RTreeEntryBinaryHeap.put #2', () => {

    let heap =  new RTreeEntryBinaryHeap<number>(Number.POSITIVE_INFINITY, 7);
    heap.put(1, mkPointEntry(1, 1, 1))
    heap.put(8, mkPointEntry(8, 8, 8))
    heap.put(2, mkPointEntry(2, 2, 2))
    heap.put(5, mkPointEntry(5, 5, 5))
    heap.put(9, mkPointEntry(9, 9, 9))
    heap.put(6, mkPointEntry(6, 6, 6))
    heap.put(3, mkPointEntry(3, 3, 3))
    heap.put(4, mkPointEntry(4, 4, 4))
    heap.put(0, mkPointEntry(0, 0, 0))
    heap.put(7, mkPointEntry(7, 7, 7))

    
    let received = heap.toIndexedSeq();
    let expected = new ShiftedRTreeEntryIndexedSeq([
      mkPointEntry(6, 6, 6),
      mkPointEntry(5, 5, 5),
      mkPointEntry(3, 3, 3),
      mkPointEntry(1, 1, 1),
      mkPointEntry(4, 4, 4),
      mkPointEntry(2, 2, 2),
      mkPointEntry(0, 0, 0)],7);
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    console.log(received.toString());
    expect(receivedItem).toBe(asExpected);   


  });

});


