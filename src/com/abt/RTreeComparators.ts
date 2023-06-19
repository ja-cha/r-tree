
import { RTreeIface } from './RTree'


interface Comparator<RTreeIface> {
    compare: (t1: RTreeIface, t2: RTreeIface) => number;
  }
  
  class XComparator<A> implements Comparator<RTreeIface<A>> {
    compare = (t1: RTreeIface<A>, t2: RTreeIface<A>) =>
      (t1.getMinX() + t1.getMaxX()) - (t2.getMinX() + t2.getMaxX())
  }
  
  class YComparator<A> implements Comparator<RTreeIface<A>> {
    compare = (t1: RTreeIface<A>, t2: RTreeIface<A>) =>
      (t1.getMinY() + t1.getMaxY()) - (t2.getMinY() + t2.getMaxY())
  }
  

export { Comparator, XComparator, YComparator }