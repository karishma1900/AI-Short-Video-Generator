import React from 'react'
import { Composition } from 'remotion'
import RemotionVideo from '../dashboard/_components/RemotionVideo'
import Header from '../dashboard/_components/Header'
function RemotionRoot() {
  return (
    <div>  <>
      <Composition
        id="Empty"
        component={RemotionVideo}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Header />
    </>
      
    </div>
  )
}

export default RemotionRoot
