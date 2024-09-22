// components/Sketch.js
import { useRef, useEffect, useState } from 'react';

const Sketch = () => {
  const sketchRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const loadP5 = async () => {
      if (!sketchRef.current) return;

      const p5 = (await import('p5')).default;

      const sketch = (p) => {
        let flow_grid = [];
        let particles = [];
        let number_of_particles = 20000; // 设定适中的粒子数量以保证流畅运行
        let tick = 0;
        let offset = 100;

        let flow_cell_size = 3; // 细化单元格以增加流动效果
        let noise_size = 0.001; // 控制噪声参数来调整流动性和细节
        let noise_radius = 0.06; // 调整噪声半径

        let flow_width;
        let flow_height;

        p.setup = function () {
          p.createCanvas(viewportSize.width, viewportSize.height);
          p.background(255); // 设定为白色背景
          p.smooth();
          p.noStroke();

          flow_width = (p.width + offset * 2) / flow_cell_size;
          flow_height = (p.height + offset * 2) / flow_cell_size;

          init_particles();
          init_flow();
        };

        p.draw = function () {
          p.background(255); // 每帧都清除背景，保持白色底
          p.translate(-offset, -offset);
          update_particles();
          display_particles();
          tick += 0.002;
        };

        p.windowResized = function () {
          p.resizeCanvas(viewportSize.width, viewportSize.height);
          p.background(255); // 保持背景为白色

          flow_width = (p.width + offset * 2) / flow_cell_size;
          flow_height = (p.height + offset * 2) / flow_cell_size;

          flow_grid = [];
          particles = [];
          init_particles();
          init_flow();
        };

        function init_particles() {
          for (let i = 0; i < number_of_particles; i++) {
            let r = p.random(p.width + 2 * offset);
            let q = p.random(p.height + 2 * offset);
            particles.push({
              prev: p.createVector(r, q),
              pos: p.createVector(r, q),
              vel: p.createVector(0, 0),
              acc: p.createVector(0, 0),
              seed: i,
            });
          }
        }

        function update_particles() {
          for (let prt of particles) {
            let flow = get_flow(prt.pos.x, prt.pos.y);
            prt.prev.set(prt.pos);
            prt.pos.x = mod(prt.pos.x + prt.vel.x, p.width + 2 * offset);
            prt.pos.y = mod(prt.pos.y + prt.vel.y, p.height + 2 * offset);
            prt.vel.add(prt.acc).normalize().mult(2.2);
            prt.acc.set(flow).mult(3);
          }
        }

        function init_flow() {
          for (let i = 0; i < flow_height; i++) {
            let row = [];
            for (let j = 0; j < flow_width; j++) {
              row.push(calculate_flow(j * noise_size, i * noise_size, noise_radius));
            }
            flow_grid.push(row);
          }
        }

        function calculate_flow(x, y, r) {
          let high_val = 0;
          let low_val = 1;
          let high_pos = p.createVector(0, 0);
          let low_pos = p.createVector(0, 0);

          for (let i = 0; i < 100; i++) {
            let angle = (i / 100) * p.TAU;
            let pos = p.createVector(x + p.cos(angle) * r, y + p.sin(angle) * r);
            let val = p.noise(pos.x, pos.y);

            if (val > high_val) {
              high_val = val;
              high_pos.set(pos);
            }
            if (val < low_val) {
              low_val = val;
              low_pos.set(pos);
            }
          }

          let flow_angle = p.createVector(low_pos.x - high_pos.x, low_pos.y - high_pos.y);
          flow_angle.normalize().mult(high_val - low_val);

          return flow_angle;
        }

        function get_flow(xpos, ypos) {
          xpos = p.constrain(xpos, 0, p.width + offset * 2);
          ypos = p.constrain(ypos, 0, p.height + offset * 2);
          return flow_grid[p.floor(ypos / flow_cell_size)][p.floor(xpos / flow_cell_size)];
        }

        function display_particles() {
          p.strokeWeight(1); // 使用较细的线条
          p.stroke(0, 0, 0, 50); // 黑色线条，保持透明度适中
          for (let prt of particles) {
            if (p5.Vector.dist(prt.prev, prt.pos) < 10) {
              p.line(prt.prev.x, prt.prev.y, prt.pos.x, prt.pos.y);
            }
          }
        }

        function mod(x, n) {
          return ((x % n) + n) % n;
        }
      };

      const p5Instance = new p5(sketch, sketchRef.current);

      return () => {
        p5Instance.remove();
      };
    };

    loadP5();

    return () => {
      sketchRef.current = null;
    };
  }, [viewportSize]);

  return (
    <div
      ref={sketchRef}
      style={{
        position: 'fixed', // 确保画布固定在视口内
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // 设置为背景层
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        border: 'none', // 确保没有边框
      }}
    ></div>
  );
};

export default Sketch;
