import { 
  mkRectangleEntry,
  mkPointEntry,
    distanceCalculatorImpl, 
    RTreeEntryIndexedSeq ,} from '../../../src/com/abt/RTreeUtils'


describe('RTreeEntry Tests' , () => {
  test('RTreeEntry.entries #1', () => {
    let received = mkRectangleEntry(1,2,1,2,5).entries() ;
    let expected = [mkPointEntry(1,2,5)];

     //something wrong with JEST matchers, got to stringify for object comparison
     let receivedItem =  JSON.stringify(received) 
     let asExpected =  JSON.stringify(expected) 
     
    expect(receivedItem).toBe(asExpected);
   
  });
  test('RTreeEntry.entries #2', () => {
    const t = () => {
      mkRectangleEntry(1,2,1,2,5).entries().get(-1)
    };   
    expect(t).toThrow("-1");
  });
  test('RTreeEntry.entries #3', () => {
    const t = () => {
      mkRectangleEntry(1,2,1,2,5).entries().get(1)
    };   
    expect(t).toThrow("1");
  });
  test('RTreeEntry.nearestOption #1', () => {
    let received = mkRectangleEntry(1,2,1,2,5).nearestOption(0,0, 1.0)(distanceCalculatorImpl) ;
    let expected = null;

     //something wrong with JEST matchers, got to stringify for object comparison
     let receivedItem =  JSON.stringify(received) 
     let asExpected =  JSON.stringify(expected) 
     
    expect(receivedItem).toBe(asExpected);
  });
  test('RTreeEntry.nearestOption #2', () => {
    let received = mkRectangleEntry(1,2,1,2,5).nearestOption(0,0)(distanceCalculatorImpl) ;
    let expected = mkRectangleEntry(1,2,1,2,5);

     //something wrong with JEST matchers, got to stringify for object comparison
     let receivedItem =  JSON.stringify(received) 
     let asExpected =  JSON.stringify(expected) 
     
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.nearestOption #3', () => {
    let received = mkRectangleEntry(1,2,1,2,5).nearestOption(1,2)(distanceCalculatorImpl) ;
    let expected = mkRectangleEntry(1,2,1,2,5);

     //something wrong with JEST matchers, got to stringify for object comparison
     let receivedItem =  JSON.stringify(received) 
     let asExpected =  JSON.stringify(expected) 
     
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.nearestK #1', () => {
    let received = mkRectangleEntry(1,2,1,2,5).nearestK(0, 0, 3, 1.0)(distanceCalculatorImpl) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

     //something wrong with JEST matchers, got to stringify for object comparison
     let receivedItem =  JSON.stringify(received) 
     let asExpected =  JSON.stringify(expected) 
     
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.nearestK #2', () => {
    let received = mkRectangleEntry(1,2,1,2,5).nearestK(0, 0, 0)(distanceCalculatorImpl) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;


     //something wrong with JEST matchers, got to stringify for object comparison
     let receivedItem =  JSON.stringify(received) 
     let asExpected =  JSON.stringify(expected) 
     
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.nearestK #3', () => {
    let received = mkRectangleEntry(1,2,1,2,5).nearestK(0, 0, 3)(distanceCalculatorImpl) ;
    let expected = [mkRectangleEntry(1,2,1,2,5)] ;

     //something wrong with JEST matchers, got to stringify for object comparison
     let receivedItem =  JSON.stringify(received) 
     let asExpected =  JSON.stringify(expected) 
     
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.nearestK #4', () => {
    let received = mkRectangleEntry(1,2,1,2,5).nearestK(1, 2, 3)(distanceCalculatorImpl) ;
    let expected = [mkRectangleEntry(1,2,1,2,5)] ;

     //something wrong with JEST matchers, got to stringify for object comparison
     let receivedItem =  JSON.stringify(received) 
     let asExpected =  JSON.stringify(expected) 
     
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.nearestK #5', () => {
    const t = () => {
      mkRectangleEntry(1,2,1,2,5).nearestK(0, 0, 3)(distanceCalculatorImpl).get(-1);        
    };   
      expect(t).toThrow("-1");
  });
  test('RTreeEntry.nearestK #6', () => {
    const t = () => {
      mkRectangleEntry(1,2,1,2,5).nearestK(0, 0, 3)(distanceCalculatorImpl).get(3);        
    };   
      expect(t).toThrow("3");
  });
  test('RTreeEntry.searchAllByPoint #1', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByPoint(0, 0) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByPoint #2', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByPoint(1, 2) ;
    let expected = [mkRectangleEntry(1,2,3,4,5)] ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByPoint #3', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByPoint(2,3) ;
    let expected = [mkRectangleEntry(1,2,3,4,5)] ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByPoint #4', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByPoint(3,4) ;
    let expected = [mkRectangleEntry(1,2,3,4,5)] ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByPoint #5', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByPoint(3,Number.NaN) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByPoint #6', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByPoint(Number.NaN,4) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByPoint #7', () => {
    const t = () => {
      mkRectangleEntry(1,2,1,2,5).searchAllByPoint(1,2).get(-1);        
    };   
      expect(t).toThrow("-1");
  });
  test('RTreeEntry.searchAllByPoint #8', () => {
    const t = () => {
      mkRectangleEntry(1,2,1,2,5).searchAllByPoint(1,2).get(3);          
    };   
      expect(t).toThrow("3");
  });
  test('RTreeEntry.searchAllByRectangle #1', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByRectangle(-1,-1,0,0) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByRectangle #2', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByRectangle(0,0,1,2) ;
    let expected = [mkRectangleEntry(1,2,3,4,5)] ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByRectangle #3', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByRectangle(2,3,4,5) ;
    let expected = [mkRectangleEntry(1,2,3,4,5)] ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByRectangle #4', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByRectangle(3,4,5,6) ;
    let expected = [mkRectangleEntry(1,2,3,4,5)] ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByRectangle #5', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByRectangle(Number.NaN,4,5,6) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByRectangle #6', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByRectangle(3,Number.NaN,5,6) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByRectangle #7', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByRectangle(3,4,Number.NaN,6) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByRectangle #8', () => {
    let received = mkRectangleEntry(1,2,3,4,5).searchAllByRectangle(3,4,5,Number.NaN) ;
    let expected = new RTreeEntryIndexedSeq<number>([],0) ;

    //something wrong with JEST matchers, got to stringify for object comparison
    let receivedItem =  JSON.stringify(received) 
    let asExpected =  JSON.stringify(expected) 
    
    expect(receivedItem).toBe(asExpected);   
  });
  test('RTreeEntry.searchAllByRectangle #9', () => {
    const t = () => {
      mkRectangleEntry(1,2,1,2,5).searchAllByRectangle(0,0,1,2).get(-1);        
    };   
      expect(t).toThrow("-1");
  });
  test('RTreeEntry.searchAllByRectangle #10', () => {
    const t = () => {
      mkRectangleEntry(1,2,1,2,5).searchAllByRectangle(0,0,1,2).get(3);          
    };   
      expect(t).toThrow("3");
  });
});
