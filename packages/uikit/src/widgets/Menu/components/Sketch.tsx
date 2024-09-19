// components/Sketch.js
import { useRef, useEffect } from 'react';

const Sketch = () => {
  const sketchRef = useRef(null);

  useEffect(() => {
    const loadP5 = async () => {
      if (!sketchRef.current) return;

      const p5 = (await import('p5')).default;

      const sketch = (p) => {
        let flow_grid = [];
        let particles = [];
        let number_of_particles = 4500;
        let tick = 0;
        let offset = 100;

        let flow_cell_size = 10;
        let noise_size = 0.003;
        let noise_radius = 0.1;

        let flow_width;
        let flow_height;

        p.setup = function () {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.background('#fff');
          p.smooth();
          p.noStroke();

          flow_width = (p.width + offset * 2) / flow_cell_size;
          flow_height = (p.height + offset * 2) / flow_cell_size;

          init_particles();
          init_flow();
        };

        p.draw = function () {
          p.translate(-offset, -offset);
          update_particles();
          display_particles();
          tick += 0.002;
        };

        p.windowResized = function () {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          p.background('#fff');

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
              col: p.random(255),
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
          p.strokeWeight(2);
          p.stroke(67, 75, 52, 1);
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
  }, []);

  return (
    <div
      ref={sketchRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    ></div>
  );
};

export default Sketch;
