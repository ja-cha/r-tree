import { RTree, RTreeEntry, RTreeIface, RTreeNil } from "../../../src/com/abt/RTree";
import { 
  mkRectangleEntry,
  IndexOutOfBoundsException,  
  distanceCalculatorImpl, 
  RTreeEntryBinaryHeap, 
  RTreeEntryIndexedSeq, 
  AdaptedRTreeEntryIndexedSeq ,} from '../../../src/com/abt/RTreeUtils'

  describe('RTreeNil Tests' , () => {
    test('RTreeNil.minX', () => {
      const t = () => {
        new RTree<number>().build([]).getMinX()
      };   
      expect(t).toThrow("RTreeNil.minX");
    });
    test('RTreeNil.maxX', () => {
      const t = () => {
        new RTree<number>().build([]).getMaxX()
      };   
      expect(t).toThrow("RTreeNil.maxX");
    });
    test('RTreeNil.minY', () => {
      const t = () => {
        new RTree<number>().build([]).getMinY()
      };   
      expect(t).toThrow("RTreeNil.minY");
    });
    test('RTreeNil.minX', () => {
      const t = () => {
        new RTree<number>().build([]).getMaxY()
      };   
      expect(t).toThrow("RTreeNil.maxY");
    });
    test('RTreeNil.entries #1', () => {
      
        let entries = new RTree<number>().build([]).entries();
        let expected  = new AdaptedRTreeEntryIndexedSeq<RTreeEntry<number>>([]);
        expect(JSON.stringify(entries))
          .toBe(JSON.stringify(expected));
        
    });
    test('RTreeNil.entries #2', () => {
      const t = () => {
        new RTree<number>().build([]).entries().get(-1);
      };   
      expect(t).toThrow(IndexOutOfBoundsException);
  });
  test('RTreeNil.entries #3', () => {
    const t = () => {
      new RTree<number>().build([]).entries().get(0);
    };   
    expect(t).toThrow(IndexOutOfBoundsException);
  });

  test('RTreeNil.nearestK #1', () => {
   
    let received = new RTree<number>().build([]).nearestK(0, 0, 3)(distanceCalculatorImpl);
    let expected = new RTreeEntryBinaryHeap<number>(Number.POSITIVE_INFINITY, 3).toIndexedSeq() ;
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let asExpected =  JSON.stringify(expected) 
    let receivedItem =  JSON.stringify(received) 

    expect( receivedItem ).toBe( asExpected );
  });
 
  test('RTreeNil.nearestK #2', () => {
   
    const t = () => {
      let calculateNearestWith = new RTree<number>().build([]).nearestK(0, 0, 3);
      calculateNearestWith(distanceCalculatorImpl).get(-1)
      
    };   
      expect(t).toThrow("-1");
  });
 
  test('RTreeNil.nearestK #3', () => {
   
    const t = () => {
      let calculateNearestWith = new RTree<number>().build([]).nearestK(0, 0, 3);
      calculateNearestWith(distanceCalculatorImpl).get(0)
      
    };   
      expect(t).toThrow("0");
  });

  test('RTreeNil.searchAllByRectangle (by rectangle) #1', () => {

    let received = new RTree<number>().build([]).searchAllByRectangle(0, 0, 0,0);
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let asExpected =  JSON.stringify(expected) 
    let receivedItem =  JSON.stringify(received) 

    expect( receivedItem ).toBe( asExpected );
  });

  test('RTreeNil.searchAllByRectangle (by rectangle) #2', () => {
   
    const t = () => {
      new RTree<number>().build([]).searchAllByRectangle(0, 0, 0,0).get(-1);        
    };   
      expect(t).toThrow("-1");
  });
 
  test('RTreeNil.searchAllByRectangle (by rectangle) #3', () => {
   
    const t = () => {
      new RTree<number>().build([]).searchAllByRectangle(0, 0, 0,0).get(0);        
    };   
      expect(t).toThrow("0");
  });

  test('RTreeNil.equals #1', () => {

    let received = new RTree<number>().build([]);
    let expected = new RTreeNil<number>() ;
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let asExpected =  JSON.stringify(expected) 
    let receivedItem =  JSON.stringify(received) 

    expect( receivedItem ).toBe( asExpected );
  });

  test('RTreeNil.equals #2', () => {

    let received = new RTree<boolean>().build([]);
    let expected = new RTreeNil<boolean>() ;
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let asExpected =  JSON.stringify(expected) 
    let receivedItem =  JSON.stringify(received) 

    expect( receivedItem ).toBe( asExpected );
  });

  test('RTreeNil.equals #3', () => {

    let received = new RTreeNil<number>();
    let expected:number[] = [] ;
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let asExpected =  JSON.stringify(expected) 
    let receivedItem =  JSON.stringify(received) 

    expect( receivedItem ).not.toBe(asExpected );
  });
 
  test('RTreeNil.equals #4', () => {

    let received = new RTreeNil<number>();
    let expected:RTreeEntry<number> = mkRectangleEntry<number>(1,2,1,2,5) ;
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let asExpected =  JSON.stringify(expected) 
    let receivedItem =  JSON.stringify(received) 

    expect( receivedItem ).not.toBe(asExpected );
  });

  test('RTreeNil.equals #5', () => {

    let received = new RTreeNil<number>();
    let expected:RTreeIface<number> = new RTreeNil<number>().build([mkRectangleEntry<number>(1,2,1,2,5)]) ;
    
    //something wrong with JEST matchers, got to stringify for object comparison
    let asExpected =  JSON.stringify(expected) 
    let receivedItem =  JSON.stringify(received) 

    expect( receivedItem ).not.toBe(asExpected );
  });

});


