import pkg from '../../package.json';
import css from "./style.css"
import {
    h,
    app,
    text
} from "hyperapp"
import {
    regionsText
} from "@nucleome/nb-tools"
const version = pkg.version
const _n = pkg.name.split("/")
const name = _n[_n.length - 1]
const jsx = (type, props, ...children) => /** @jsx jsx */
    typeof type === "function" ?
    type(props, children) :
    h(
        type,
        props || {}, [].concat(...children)
        .map((any) =>
            typeof any === "string" || typeof any === "number" ? text(any) : any
        )
    )


var render = (container, el, _state, name, version, dispatch) => {
    var setCurrent = (d) => (state) => {
        var r = {
            ...state,
            current: d,
        }
        container.setState(r)
        return r
    }
    var save = (state,e)  => {
        var d = state.regionList.map(d =>(d))
        d.push({regions:state.current}) //TODO 
        var r = {
            ...state,
            regionList: d
        }
        container.setState(r)
        return r
    }
    var deleteEntry = (i) => (state,e) => {
        var d = state.regionList.map(d =>(d))
        d.splice(i,1)
        var r = {
            ...state,
            regionList: d
        }
        container.setState(r)
        return r

    }
    var action = (d) => (state,e) => {
        dispatch.call("update",this,d)
        var r = {
            ...state,
            current: d,
        }
        container.setState(r)
        return r

    }
    // add core ... 
    var onMessage = (dispatch, props) => {
        props.dispatch.on("update.app", (d) => {
            dispatch(setCurrent(d));
        })
        return function() {};
    };
    var vdom = {
        init: _state,
        view: (state, props) => {
            return (
                <div class="main" version="5">
                <div class="title">
                </div>
                <div>
                <input type="button" value="Add to List" onclick={save}></input>
                <span>{regionsText(state.current)}</span>
                </div>
                <div>
                <hr/>
                <ul>
                {state.regionList.map((d,i) => {
                    return (<li>
                       <input type="button" value="x" onclick={deleteEntry(i)}></input> 
                        <span onclick={action(d.regions)} class="entry">
                        <span>No.{i+1}</span>
                        <span>{regionsText(d.regions)}</span>
                        </span>
                    </li>)
                })}
                </ul>
                </div>
        </div>)
        },
        subscriptions: (state) => [
            [onMessage, {
                dispatch: dispatch
            }]
        ],
        node: el
    };
    app(vdom)
}


class Notebook extends HTMLElement {
    constructor(container, state, dispatch) {
        super()
        var self = this
        this.container = container
        this.shadow = this.attachShadow({
            mode: "open"
        })
        var style = document.createElement("style")
        style.innerHTML = css.toString()
        var div = document.createElement("div")
        this.shadow.appendChild(style)
        this.shadow.appendChild(div)
        this.div = div
        this.state = state
        this.dispatch = dispatch 
       }
    connectedCallback() {
        render(this.container, this.div, this.state, name, version, this.dispatch)
    }
    disconnectedCallback() {

    }
    static get is() {
        return name
    }
}

customElements.define(Notebook.is, Notebook)
export default Notebook
