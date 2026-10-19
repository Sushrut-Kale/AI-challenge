import '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    // Ensure all standard Three.js elements are available
    mesh: ThreeElements['mesh'];
    group: ThreeElements['group'];
  }
}
