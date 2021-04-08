import {select} from "d3-selection"
import {dispatch as d3_dispatch} from "d3-dispatch"
import Notebook from "./Notebook"
export default function(layout, container, state, app) {
    var inCtrl = false;
    select(container.getElement()[0])
        .on("mouseover", function() {
            inCtrl = true;
        })
        .on("mouseout", function() {
            inCtrl = false;
        })
    var cfg = select(container.getElement()[0]).append("div").classed("cfg", true);
    cfg.style("padding-left", "10px")
    var dispatch = d3_dispatch("update", "brush", "setState", "entry")
    var content = select(container.getElement()[0]).append("div")
        .classed("content", true)
        .style("position", "relative")
    // TODO Add NoteBook Component width
    state.regionList = state.regionList || []
    state.current = state.current || []
    var notebook = new Notebook(container, state,dispatch)
    content.node().appendChild(notebook)

    dispatch.on("setState", function() {
        container.setState(state)
    })
    var TO = false
    const resize = () => {
        console.log("TODO resize")
    }
    container.on("resize", function(e) {
        if (TO !== false) clearTimeout(TO)
        TO = setTimeout(resize, 200)
    })

    layout.eventHub.on("update", function(d) {
        if (!inCtrl) {
            dispatch.call("update", this, d)
        }
    })

    layout.eventHub.on("brush", function(d) {
        if (!inCtrl) {
            dispatch.call("brush", this, d)
        }
    })

    /* Response to Local Panel Event */
    dispatch.on("update", function(d0) {
        var d = JSON.parse(JSON.stringify(d0))
        if (inCtrl) {
            //regions = d
            state.regions = d
            layout.eventHub.emit("update", d)
            layout.eventHub.emit("sendMessage", {
                "code": "update",
                data: JSON.stringify(d)
            })
            layout.eventHub.emit("updateApp", {
                "regions": d
            })
            layout.eventHub.emit("sendMessage", {
                "code": "updateApp",
                data: JSON.stringify({
                    "regions": d
                })
            })
        }
    })
    dispatch.on("brush", function(d) {
        if (inCtrl) {
            layout.eventHub.emit("brush", d)
            layout.eventHub.emit("sendMessage", {
                "code": "brush",
                data: JSON.stringify(d)
            })
        }
    })
}
