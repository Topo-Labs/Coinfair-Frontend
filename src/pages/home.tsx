import React, { useState, Suspense, memo } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Lightformer, ContactShadows, Environment, MeshTransmissionMaterial, Text } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, TiltShift2 } from "@react-three/postprocessing";
import { easing } from "maath";
import { useMatchBreakpointsContext, Button, Logo, LogoWithTextIcon } from "@pancakeswap/uikit";

const JoinUsButton = styled(Button)`
  width: 120px;
  color: #000;
  background: transparent;
  border-radius: 30px;
  font-size: 16px;
  border: 1px solid #000;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background: #000;
    color: #fff;
    opacity: 1;
  }
`

const MobileHomeCotainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #e0e0e0;
`

const MobileSlogan = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  line-height: 50px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
`

const MobileDesc = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  span {
    font-size: 0.9rem;
    line-height: 1.1rem;
  }
`

const MobileBtns = styled.div`
  display: flex;
  justify-content: center;
`

const DesktopLogo = styled(LogoWithTextIcon)`
  margin-left: 45px;
  transform: scale(1.2);
`

const MobileLogo = styled(LogoWithTextIcon)`
  position: fixed;
  top: 10px;
  left: 45%;
  margin: 0 auto;
  transform: scale(0.8) translateX(-45%);
`

const DesktopHome = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Canvas
        eventSource={document.getElementById("root")}
        eventPrefix="client"
        shadows
        camera={{ position: [0, 0, 20], fov: 50 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#e0e0e0"]} />
        <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />
        <Status />

        <Suspense fallback={null}>
          <Float floatIntensity={2}>
            <Torus hovered={hovered} setHovered={setHovered} />
          </Float>
          <ContactShadows scale={100} position={[0, -7.5, 0]} blur={1} far={100} opacity={0.85} />
          <Environment>
            <Lightformer intensity={8} position={[15, 5, 0]} scale={[10, 50, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
          </Environment>
        </Suspense>

        <EffectComposer enableNormalPass={false}>
          <N8AO aoRadius={1} intensity={1.5} />
          <Bloom mipmapBlur luminanceThreshold={0.8} intensity={1.5} levels={6} />
          <TiltShift2 blur={0.15} />
        </EffectComposer>

        <Rig />
      </Canvas>
      
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 999,
          display: 'flex',
          width: '99%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <DesktopLogo/>
        <div>
          <Link href="/swap">
            <Button
              style={{
                width: '120px',
                color: "#fff",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Trade
            </Button>
          </Link>
          <JoinUsButton
            onClick={() => window.open('https://t.co/hhsIVrD2TY')}
          >
            Join Us
          </JoinUsButton>
        </div>
      </div>

      {/* 显示文字 */}
      <div
        style={{
          width: '90%',
          height: '90vh',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 999,
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            transform: "translateY(-50%)",
            color: "white",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: '20px',
            padding: '20px',
            background: 'rgba(0, 0, 0, .5)',
            width: '300px',
            borderRadius: '20px',
            fontSize: "20px",
          }}
        >
          From AMM to BMM, trading depth comparable to top-tier CEXs
        </div>

        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "10%",
            transform: "translateY(-50%)",
            color: "white",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: '20px',
            padding: '20px',
            background: 'rgba(0, 0, 0, .5)',
            width: '300px',
            borderRadius: '20px',
            fontSize: "20px",
          }}
        >
          DRS enables commission profit feedback to the users
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "30%",
            transform: "translateX(-50%)",
            color: "white",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: '20px',
            padding: '20px',
            background: 'rgba(0, 0, 0, .5)',
            width: '300px',
            borderRadius: '20px',
            fontSize: "20px",
          }}
        >
          100% of platform revenue is distributed to users
        </div>
      </div>
    </>
  );
};

// 控制相机角度的 Rig 组件
const Rig = memo(() => {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [Math.sin(-state.pointer.x) * 15, state.pointer.y * 3.5, 15 + Math.cos(state.pointer.x) * 10],
      0.2,
      delta,
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null;
})

// Torus 组件，负责显示 Torus 几何体，并根据 hover 状态控制事件
const Torus = ({ hovered, setHovered }) => {
  return (
    <mesh
      receiveShadow
      castShadow
      onPointerEnter={() => setHovered(true)}  // 鼠标悬停事件
      onPointerLeave={() => setHovered(false)}  // 鼠标移出事件
    >
      <torusGeometry args={[4, 1.2, 128, 64]} />
      <MeshTransmissionMaterial
        backsideThickness={5}
        thickness={1}
        transmission={1.2}
        color={[1, 1, 1]}
      />
    </mesh>
  )
};

const Status = memo(() => {
  return (
    <Text fontSize={14} letterSpacing={-0.1} color="#000" position={[0, 0, -60]}>
      New DEX leading the future
    </Text>
  );
})

const MobileHome = () => {
  return (
    <MobileHomeCotainer>
      <MobileLogo/>
      <MobileSlogan>New DEX</MobileSlogan>
      <MobileSlogan>Leading the future</MobileSlogan>
      <MobileDesc>
        <span>From AMM to BMM,</span>
        <span>trading depth comparable to top-tier CEXs.</span>
        <span>DRS enables commission profit feedback to the users.</span>
        <span>100% of platform revenue is distributed to users.</span>
      </MobileDesc>
      <MobileBtns>
        <Link href="/swap">
          <Button
            style={{
              width: '120px',
              color: "#fff",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Trade
          </Button>
        </Link>
        <JoinUsButton
          onClick={() => window.open('https://t.co/hhsIVrD2TY')}  // 按钮跳转到加入我们页面
        >
          Join Us
        </JoinUsButton>
      </MobileBtns>
    </MobileHomeCotainer>
  )
}

const Home = () => {

  const { isDesktop } = useMatchBreakpointsContext()

  return (
    <>
      {
        isDesktop ? <DesktopHome /> : <MobileHome/>
      }
    </>
  )
}

export default Home;
