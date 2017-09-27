module.exports = function retargetEvents(shadowRoot) {

    const events = ["onAbort",
        "onAnimationCancel",
        "onAnimationEnd",
        "onAnimationIteration",
        "onAuxClick",
        "onBlur",
        "onChange",
        "onClick",
        "onClose",
        "onContextMenu",
        "onDoubleClick",
        "onError",
        "onFocus",
        "onGotPointerCapture",
        "onInput",
        "onKeyDown",
        "onKeyPress",
        "onKeyUp",
        "onLoad",
        "onLoadEnd",
        "onLoadStart",
        "onLostPointerCapture",
        "onMouseDown",
        "onMouseMove",
        "onMouseOut",
        "onMouseOver",
        "onMouseIp",
        "onPointerCancel",
        "onPointerDown",
        "onPointerEnter",
        "onPointerLeave",
        "onPointerMove",
        "onPointerOut",
        "onPointerOver",
        "onPointerUp",
        "onReset",
        "onResize",
        "onScroll",
        "onSelect",
        "onSelectionChange",
        "onSelectStart",
        "onSubmit",
        "onTouchCancel",
        "onTouchMove",
        "onTouchStart",
        "onTransitionCancel",
        "onTransitionEnd",
        "onDrag",
        "onDragEnd",
        "onDragEnter",
        "onDragExit",
        "onDragLeave",
        "onDragOver",
        "onDragStart",
        "onDrop"];

    events.forEach(function (eventType) {
        let transformedEventType;
        if(eventType === 'onDoubleClick'){
            transformedEventType = 'dblclick';
        }else{
            transformedEventType = eventType.replace(/^on/, '').toLowerCase();
        }

        shadowRoot.addEventListener(transformedEventType, function (event) {
            for (var i = 0; i < event.path.length; i++) {
                const item = event.path[i];
                const internalComponent = findReactInternal(item);

                if (internalComponent && internalComponent._currentElement && internalComponent._currentElement.props) {
                    dispatchEvent(event, eventType, internalComponent._currentElement.props);
                    // This mimics React's onChange behavior
                    if (eventType === 'onInput') {
                        dispatchEvent(event, 'onChange', internalComponent._currentElement.props);
                    }
                }

                if (item === shadowRoot) {
                    break;
                }
            }
        });
    });
};

function findReactInternal(item) {
    var instance;
    for (var key in item) {
        if (item.hasOwnProperty(key) && key.indexOf('_reactInternal') !== -1) {
            instance = item[key];
            break;
        }
    }
    return instance;
}

function dispatchEvent(event, eventType, itemProps) {
    if (itemProps[eventType]) {
        itemProps[eventType](event);
    }
}
