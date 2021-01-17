/**
 *
 * @param { HTMLElement } el
 * @param { Event } event
 * @param { Function } cb
 */
const on = (el, event, cb) => {
  el.addEventListener(event, cb, false);
};

/**
 *
 * @param { HTMLElement } el
 * @param { Event } event
 * @param { Function } cb
 */
const off = (el, event, cb) => {
  el.removeEventListener(event, cb, false);
};

/**
 *
 * @param { HTMLElement } el
 * @param { String } attr
 * @param { String } defaultValue
 */
function hasAttr(el, attr) {
  return el.hasAttribute(attr)
}

/**
 * v-move
 * @example
 * ```vue
 * <dialog ref="dialog" v-move="() => $refs.dialog" move-out>
 * </dialog>
 * ```
 */
export default {
  bind(el, { expression, value }) {
    if (!expression) {
      return "";
    }

    el.__move__ = {
      //  允许移动到屏幕外
      moveOut: hasAttr(el, "move-out"),
      //  x坐标根据右侧进行偏移
      xByRight: hasAttr(el, "move-x-right"),
      //  y坐标根据底部进行偏移
      yByBottom: hasAttr(el, "move-y-bottom"),
      cursor: el.getAttribute("move-cursor") || "cursor"
    };

    //  settimeout是为了等待dom完全mounted后再执行获取正确的值
    setTimeout(() => {
      //  正在移动
      let isMoving = false;
      //  当前拖拽移动节点
      const targetNode = value();

      targetNode.style.position = "fixed";

      /**
       * 处理鼠标按下事件，记录鼠标的各项位置，准备拖拽窗体
       */
      function handleMouseDown(event) {
        const el = event.target;
        const moveDisabled = el.getAttribute("move-disabled");
        if (moveDisabled) {
          return false;
        }

        isMoving = true;
        //  拖拽前光标位置距离整个页面左侧的距离
        el.__move__.disX = event.clientX - targetNode.offsetLeft;
        //  拖拽前光标位置距离整个页面顶部的距离
        el.__move__.disY = event.clientY - targetNode.offsetTop;

        //  鼠标移动（移动窗口）
        on(document, "mousemove", handleMouseMove);
        //  鼠标按键松开（停止移动窗口）
        on(document, "mouseup", handleMouseUp);
      }

      /**
       * 处理鼠标移动事件，更新窗体的位置
       * @param { Event } event
       */
      function handleMouseMove(event) {
        event.preventDefault();
        event.stopPropagation();
        if (isMoving) {
          let xLoc;
          let yLoc;

          if(el.__move__.xByRight) {
            xLoc = document.documentElement.clientWidth -
              event.clientX -
              (targetNode.clientWidth - el.__move__.disX)
          } else {
            xLoc = event.clientX - el.__move__.disX;
          }

          if(el.__move__.yByBottom) {
            yLoc = document.documentElement.clientHeight -
            event.clientY -
            (targetNode.clientHeight - el.__move__.disY)
          } else {
            yLoc = event.clientY - el.__move__.disY;
          }

          if (!el.__move__.moveOut) {
            const setRight =
              document.documentElement.clientWidth - targetNode.clientWidth;

            const setBottom =
              document.documentElement.clientHeight - targetNode.clientHeight;

            if (xLoc < 0) {
              xLoc = 0;
            }
            if (xLoc > setRight) {
              xLoc = setRight;
            }
            if (yLoc < 0) {
              yLoc = 0;
            }
            if (yLoc > setBottom) {
              yLoc = setBottom;
            }
          }

          if (el.__move__.xByRight) {
            targetNode.style.right = xLoc + "px";
          } else {
            targetNode.style.left = xLoc + "px";
          }

          if (el.__move__.yByBottom) {
            targetNode.style.bottom = yLoc + "px";
          } else {
            targetNode.style.top = yLoc + "px";
          }

          targetNode.style.cursor = el.__move__.cursor;
        }
      }

      /**
       * 鼠标按键松开事件，移除移动中状态
       */
      function handleMouseUp() {
        isMoving = false;
        targetNode.style.cursor = "";
        //  取消监听
        off(document, "mousemove", handleMouseMove);
        off(document, "mouseup", handleMouseUp);
      }

      el.__move__.handleMouseDown = handleMouseDown;

      on(el, "mousedown", el.__move__.handleMouseDown);
    }, 0);
  },
  unbind(el) {
    off(el, "mousedown", el.__move__.handleMouseDown);
  }
};
