import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Section = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
  color: '#000',
  willChange: 'transform, opacity',
}));

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const scrollYRef = useRef(0);
  const lastTimeRef = useRef(0);

  const handleScroll = () => {
    const currentTime = Date.now();
    if (currentTime - lastTimeRef.current > 20) {
      scrollYRef.current = window.scrollY;
      setScrollY(scrollYRef.current);
      lastTimeRef.current = currentTime;
    }
  };

  useEffect(() => {
    const handleWheel = () => {
      handleScroll();
    };

    window.addEventListener('scroll', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWheel);
    };
  }, []);

  return (
    <div>
      <Section>
        <motion.div
          style={{
            textAlign: 'center',
            transformOrigin: 'center center',
          }}
          initial={{ scale: 4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Typography variant="h2">欢迎来到首页</Typography>
          <Typography variant="h5">这是一个带有滚动监听的动效页面</Typography>
        </motion.div>
      </Section>

      <Section>
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: scrollY > 500 ? 0 : 100,
            opacity: scrollY > 500 ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2">第二部分</Typography>
          <Typography variant="h5">当你滚动到这部分时，元素会出现并移动到原始位置</Typography>
        </motion.div>
      </Section>

      <Section>
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ scale: 0 }}
          animate={{ scale: scrollY > 1000 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2">第三部分</Typography>
          <Typography variant="h5">此部分的元素会在滚动到指定位置时放大</Typography>
        </motion.div>
      </Section>

      <Section>
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ rotate: 90 }}
          animate={{ rotate: scrollY > 1500 ? 0 : 90 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2">第四部分</Typography>
          <Typography variant="h5">滚动时旋转元素</Typography>
        </motion.div>
      </Section>
    </div>
  );
};

export default Home;
