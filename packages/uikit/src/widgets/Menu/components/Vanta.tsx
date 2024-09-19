// pages/index.js
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('../components/Sketch'), { ssr: false });

const Vanta = () => {
  return (
    <Sketch />
  );
}

export default Vanta
