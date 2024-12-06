import { useEffect, useState, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Section = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, .9)',
  willChange: 'transform, opacity',
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  fontSize: '80px',
  textAlign: 'center',
  background: 'linear-gradient(90deg, #fff, #ffffff)', // 从深灰色到白色的渐变
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text', // Safari 和 Chrome 兼容
  color: 'transparent',
  lineHeight: '1.2', // 行距
  backgroundSize: '200% auto',
  animation: 'shine 6s linear infinite',
  textShadow: '1px 2px 5px rgba(0, 0, 0, 1), 0 0 15px rgba(255, 255, 255, 1)', // 立体感的阴影
  '@keyframes shine': {
    '0%': { backgroundPosition: '200% right' },
    '100%': { backgroundPosition: '-200% center' },
  },
}));

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const scrollYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const { scrollYProgress } = useScroll();

  // 控制滚动事件触发频率
  const handleScroll = () => {
    const currentTime = Date.now();
    if (currentTime - lastTimeRef.current > 20) {  // 控制滚动更新频率
      scrollYRef.current = window.scrollY;
      setScrollY(scrollYRef.current);  // 仅在滚动偏移较大时更新状态
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
    <Box>
      {/* 第一个Section: 缩放与文字颜色动画 */}
      <Section>
        <motion.div
          style={{
            textAlign: 'center',
            transformOrigin: 'center center',
          }}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <GradientTypography variant="h1">New DEX leading the future</GradientTypography>
          <GradientTypography variant="h1">And dominating Crypto trading</GradientTypography>
        </motion.div>
        <motion.svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <motion.g
            transform="translate(50, 50)"
            style={{ opacity: scrollYProgress }}
          >
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="blue"
              animate={{ r: [40, 60, 40] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.rect
              x="120"
              y="30"
              width="60"
              height="60"
              fill="green"
              animate={{ x: [120, 150, 120] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
            />
          </motion.g>
        </motion.svg>
      </Section>

      {/* 第二个Section: 滚动时元素上下移动 */}
      <Section>
        <motion.div
          style={{
            textAlign: 'center',
            transformOrigin: 'center center',
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: scrollY > 500 ? 0 : 100,
            opacity: scrollY > 500 ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <GradientTypography variant="h1">第二部分</GradientTypography>
          <GradientTypography variant="h1">当你滚动到这部分时，元素会出现并移动到原始位置</GradientTypography>
        </motion.div>
      </Section>

      {/* 第三个Section: 滚动时放大 */}
      <Section>
        <motion.div
          style={{
            textAlign: 'center',
            transformOrigin: 'center center',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: scrollY > 1000 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <GradientTypography variant="h1">第三部分</GradientTypography>
          <GradientTypography variant="h1">此部分的元素会在滚动到指定位置时放大</GradientTypography>
        </motion.div>
      </Section>

      {/* 第四个Section: 滚动时从左到右渐入 */}
      <Section>
        <motion.div
          style={{
            textAlign: 'center',
            transformOrigin: 'center center',
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{
            x: scrollY > 1500 ? 0 : '-100%',
            opacity: scrollY > 1500 ? 1 : 0,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <GradientTypography variant="h1">第四部分</GradientTypography>
          <GradientTypography variant="h1">滚动时从左到右渐入</GradientTypography>
        </motion.div>
      </Section>
    </Box>
  );
};

export default Home;
