import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { updateTriggerPop } from "../../../store/slices/flowSlice"

const TriggerPopUp = props => {
  const { scriptId } = props
  const dispatch = useDispatch()
  const { triggerPopUp } = useSelector(state => state.canvas)
  if (triggerPopUp) {
    const name = "OAuth Permissions"
    const opts = `dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, alwaysRaised=${1}, width=800, height=600`
    const browser = window.self
    const popup = browser.open(
      `https://accounts.google.com/AccountChooser?continue=https://script.google.com/home/projects/${scriptId}/triggers`,
      name,
      opts
    )

    var timer = setInterval(function() {
      if (popup.closed) {
        clearInterval(timer)
         dispatch(updateTriggerPop(false))
      }
    }, 1000)
  }
  return <></>
}
export default TriggerPopUp
