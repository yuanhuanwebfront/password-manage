if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const isString$1 = (val) => typeof val === "string";
  const isNull = (value) => value === null;
  const isUndefined = (value) => value === void 0;
  function isDef(value) {
    return !isUndefined(value) && !isNull(value);
  }
  function isNumeric(value) {
    return !Number.isNaN(Number(value));
  }
  function isBoolean$1(value) {
    return typeof value === "boolean";
  }
  function isObject$1(x) {
    const type = typeof x;
    return x !== null && (type === "object" || type === "function");
  }
  function isPlainObject(val) {
    return val !== null && typeof val === "object" && Object.prototype.toString.call(val) === "[object Object]";
  }
  const getWindowInfo = () => uni.getWindowInfo ? uni.getWindowInfo() || uni.getSystemInfoSync() : uni.getSystemInfoSync();
  const getAppBaseInfo = () => uni.getAppBaseInfo ? uni.getAppBaseInfo() || uni.getSystemInfoSync() : uni.getSystemInfoSync();
  const getDeviceInfo = () => uni.getDeviceInfo ? uni.getDeviceInfo() || uni.getSystemInfoSync() : uni.getSystemInfoSync();
  function canUseVirtualHost() {
    let result = false;
    result = true;
    return result;
  }
  const ON_SHOW = "onShow";
  const ON_LOAD = "onLoad";
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const prefix = "t";
  getWindowInfo();
  getAppBaseInfo();
  const deviceInfo = getDeviceInfo();
  function coalesce(...args) {
    for (let i = 0; i < args.length; i += 1) {
      if (args[i] !== null && args[i] !== void 0) {
        return args[i];
      }
    }
    return args[args.length - 1];
  }
  const styles = function(styleObj) {
    return Object.keys(styleObj).map((styleKey) => `${styleKey}: ${styleObj[styleKey]}`).join("; ");
  };
  const getRect = function(context, selector, needAll = false, useH5Origin = false) {
    return new Promise((resolve, reject) => {
      uni.createSelectorQuery().in(context)[needAll ? "selectAll" : "select"](selector).boundingClientRect((rect) => {
        if (rect) {
          resolve(rect);
        } else {
          reject(rect);
        }
      }).exec();
    });
  };
  (deviceInfo == null ? void 0 : deviceInfo.environment) === "wxwork";
  ["mac", "windows"].includes(deviceInfo == null ? void 0 : deviceInfo.platform);
  const addUnit$1 = function(value) {
    if (!isDef(value)) {
      return void 0;
    }
    value = String(value);
    return isNumeric(value) ? `${value}px` : value;
  };
  const getCharacterLength = (type, char, max) => {
    const str = String(coalesce(char, ""));
    if (str.length === 0) {
      return {
        length: 0,
        characters: ""
      };
    }
    if (type === "maxcharacter") {
      let len = 0;
      for (let i = 0; i < str.length; i += 1) {
        let currentStringLength = 0;
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
          currentStringLength = 2;
        } else {
          currentStringLength = 1;
        }
        if (len + currentStringLength > max) {
          return {
            length: len,
            characters: str.slice(0, i)
          };
        }
        len += currentStringLength;
      }
      return {
        length: len,
        characters: str
      };
    }
    if (type === "maxlength") {
      const length = str.length > max ? max : str.length;
      return {
        length,
        characters: str.slice(0, length)
      };
    }
    return {
      length: str.length,
      characters: str
    };
  };
  const toCamel = (str) => str.replace(/-(\w)/g, (match, m1) => m1.toUpperCase());
  const toPascal = (name2) => name2.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  function hyphenate(str) {
    const hyphenateRE = /\B([A-Z])/g;
    return str.replace(hyphenateRE, "-$1").toLowerCase();
  }
  const calcIcon = (icon, defaultIcon) => {
    if (icon && (isBoolean$1(icon) && defaultIcon || isString$1(icon))) {
      return { name: isBoolean$1(icon) ? defaultIcon : icon };
    }
    if (isObject$1(icon)) {
      return icon;
    }
    return null;
  };
  const nextTick = () => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 33);
  });
  const getInnerControlledValue = (key) => `data${key.replace(/^(\w)/, (e, t) => t.toUpperCase())}`;
  const getDefaultKey = (key) => `default${key.replace(/^(\w)/, (e, t) => t.toUpperCase())}`;
  const ARIAL_PROPS = [
    { key: "ariaHidden", type: Boolean },
    { key: "ariaRole", type: String },
    { key: "ariaLabel", type: String },
    { key: "ariaLabelledby", type: String },
    { key: "ariaDescribedby", type: String },
    { key: "ariaBusy", type: Boolean }
  ];
  const getPropsDefault = (type, disableBoolean = false) => {
    if (type === Boolean && !disableBoolean) {
      return false;
    }
    if (type === String) {
      return "";
    }
    return void 0;
  };
  const COMMON_PROPS = {
    ...ARIAL_PROPS.reduce((acc, item) => ({
      ...acc,
      [item.key]: {
        type: item.type,
        default: getPropsDefault(item.type)
      }
    }), {}),
    customStyle: { type: [String, Object], default: "" }
  };
  const toComponent = function(options) {
    if (!options.properties && options.props) {
      options.properties = options.props;
    }
    if (options.properties) {
      Object.keys(options.properties).forEach((k) => {
        let opt = options.properties[k];
        if (!isPlainObject(opt)) {
          opt = { type: opt };
        }
        options.properties[k] = opt;
      });
    }
    if (!options.methods)
      options.methods = {};
    if (!options.lifetimes)
      options.lifetimes = {};
    const oldCreated = options.created;
    const { controlledProps = [] } = options;
    options.created = function(...args) {
      if (oldCreated) {
        oldCreated.apply(this, args);
      }
      controlledProps.forEach(({ key }) => {
        const defaultKey = getDefaultKey(key);
        const tDataKey = getInnerControlledValue(key);
        this[tDataKey] = this[key];
        if (this[key] == null) {
          this._selfControlled = true;
        }
        if (this[key] == null && this[defaultKey] != null) {
          this[tDataKey] = this[defaultKey];
        }
      });
    };
    options.methods._trigger = function(evtName, detail, opts) {
      const target = controlledProps.find((item) => item.event === evtName);
      if (target) {
        const { key } = target;
        if (this._selfControlled) {
          const tDataKey = getInnerControlledValue(key);
          this[tDataKey] = detail[key];
        }
        this.$emit(
          `update:${key}`,
          detail[key],
          opts
        );
      }
      this.$emit(
        evtName,
        detail,
        opts
      );
    };
    return options;
  };
  function sortPropsType(type) {
    if (!Array.isArray(type)) {
      return type;
    }
    type.sort((a, b) => {
      if (a === Boolean) {
        return -1;
      }
      if (b === Boolean) {
        return 1;
      }
      return 0;
    });
    return type;
  }
  function filterProps(props2, controlledProps) {
    const newProps = {};
    const emits = [];
    const reg = /^on[A-Z][a-z]/;
    const controlledKeys = Object.values(controlledProps).map((item) => item.key);
    const unControlledKeys = controlledKeys.map((key) => getDefaultKey(key));
    Object.keys(props2).forEach((key) => {
      const curType = props2[key].type || props2[key];
      if (reg.test(key) && props2[key].type === Function) {
        const str = key.replace(/^on/, "");
        const eventName = str.charAt(0).toLowerCase() + str.slice(1);
        emits.push(...[hyphenate(eventName), eventName]);
      } else if (controlledKeys.indexOf(key) > -1 || unControlledKeys.indexOf(key) > -1) {
        const newType = Array.isArray(curType) ? curType : [curType];
        newProps[key] = {
          type: [null, ...newType],
          default: null
        };
      } else if ([Boolean, String].indexOf(props2[key].type) > -1 && props2[key].default === void 0) {
        newProps[key] = {
          ...props2[key],
          default: getPropsDefault(props2[key].type, true)
        };
      } else {
        newProps[key] = {
          ...typeof props2[key] === "object" ? props2[key] : {},
          type: sortPropsType(curType)
        };
      }
    });
    return {
      newProps,
      emits
    };
  }
  const getEmitsByControlledProps = (controlledProps) => Object.values(controlledProps).map((item) => `update:${item.key}`);
  const uniComponent = function(info) {
    const { newProps, emits } = filterProps(info.props || {}, info.controlledProps || {});
    info.props = {
      ...getExternalClasses(info),
      ...newProps,
      ...COMMON_PROPS
    };
    info.emits = Array.from(/* @__PURE__ */ new Set([
      ...info.emits || [],
      ...getEmitsByControlledProps(info.controlledProps || {}),
      ...emits
    ]));
    info.options = {
      ...info.options || {},
      multipleSlots: true
    };
    if (canUseVirtualHost() && info.options.virtualHost == null) {
      info.options.virtualHost = true;
    }
    if (!info.options.styleIsolation) {
      info.options.styleIsolation = "shared";
    }
    if (info.name) {
      info.name = toPascal(info.name);
    }
    const obj = toComponent(info);
    return obj;
  };
  function getExternalClasses(info) {
    if (!info.externalClasses) {
      return {};
    }
    const { externalClasses } = info;
    const list = Array.isArray(externalClasses) ? externalClasses : [externalClasses];
    return list.reduce((acc, item) => ({
      ...acc,
      [toCamel(item)]: {
        type: String,
        default: ""
      }
    }), {});
  }
  const props$3 = {
    /** 图标颜色 */
    color: {
      type: String,
      default: ""
    },
    /** 图标名称或图片链接 */
    name: {
      type: String,
      default: "",
      required: true
    },
    /** 自定义图标前缀 */
    prefix: {
      type: String,
      default: ""
    },
    /** 图标大小, 如 `20`, `20px`, `48rpx`, 默认单位是 `px` */
    size: {
      type: [String, Number],
      default: ""
    },
    /** 点击图标时触发 */
    onClick: {
      type: Function,
      default: () => ({})
    }
  };
  function getRegExp() {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(RegExp);
    return new (Function.prototype.bind.apply(RegExp, args))();
  }
  function addUnit(value) {
    const REGEXP = getRegExp("^-?\\d+(.\\d+)?$");
    if (value == null) {
      return void 0;
    }
    return REGEXP.test(`${value}`) ? `${value}px` : value;
  }
  function isString(string) {
    return typeof string === "string";
  }
  function isArray(array) {
    return Array.isArray(array);
  }
  function isObject(x) {
    const type = typeof x;
    return x !== null && (type === "object" || type === "function");
  }
  function isBoolean(value) {
    return typeof value === "boolean";
  }
  const isNoEmptyObj = function(obj) {
    return isObject(obj) && JSON.stringify(obj) !== "{}";
  };
  function includes(arr, value) {
    if (!arr || !isArray(arr))
      return false;
    let i = 0;
    const len = arr.length;
    for (; i < len; i++) {
      if (arr[i] === value)
        return true;
    }
    return false;
  }
  function cls(base, arr) {
    const res = [base];
    let i = 0;
    for (let size = arr.length; i < size; i++) {
      const item = arr[i];
      if (item && Array.isArray(item)) {
        const key = arr[i][0];
        const value = arr[i][1];
        if (value) {
          res.push(`${base}--${key}`);
        }
      } else if (typeof item === "string" || typeof item === "number") {
        if (item) {
          res.push(`${base}--${item}`);
        }
      }
    }
    return res.join(" ");
  }
  function getBadgeAriaLabel(options) {
    const maxCount = options.maxCount || 99;
    if (options.dot) {
      return "有新的消息";
    }
    if (options.count === "...") {
      return "有很多消息";
    }
    if (isNaN(options.count)) {
      return options.count;
    }
    const str1 = `有${maxCount}+条消息`;
    const str2 = `有${options.count}条消息`;
    return Number(options.count) > maxCount ? str1 : str2;
  }
  function endsWith(str, endStr) {
    return str.slice(-endStr.length) === endStr ? str : str + endStr;
  }
  function keys(obj) {
    return JSON.stringify(obj).replace(getRegExp('{|}|"', "g"), "").split(",").map((item) => item.split(":")[0]);
  }
  function kebabCase(str) {
    return str.replace(getRegExp("[A-Z]", "g"), (ele) => `-${ele}`).toLowerCase();
  }
  function _style(styles2) {
    if (isArray(styles2)) {
      return styles2.filter((item) => item != null && item !== "").map((item) => isArray(item) || isObject(item) ? _style(item) : endsWith(item, ";")).join(" ");
    }
    if (isObject(styles2)) {
      return keys(styles2).filter((key) => styles2[key] != null && styles2[key] !== "").map((key) => [kebabCase(key), [styles2[key]]].join(":")).join(";");
    }
    return styles2;
  }
  function isValidIconName(str) {
    return getRegExp("^[A-Za-z0-9-_]+$").test(str);
  }
  const tools = {
    addUnit,
    isString,
    isArray,
    isObject,
    isBoolean,
    isNoEmptyObj,
    includes,
    cls,
    getBadgeAriaLabel,
    _style,
    isValidIconName
  };
  const _export_sfc = (sfc, props2) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props2) {
      target[key] = val;
    }
    return target;
  };
  const name$3 = `${prefix}-icon`;
  const _sfc_main$b = {
    ...uniComponent({
      name: name$3,
      options: {
        styleIsolation: "shared"
      },
      externalClasses: [`${prefix}-class`],
      props: {
        ...props$3
      },
      data() {
        return {
          componentPrefix: prefix,
          classPrefix: name$3,
          isImage: false,
          iconStyle: void 0,
          tools
        };
      },
      watch: {
        name: {
          handler() {
            this.setIconStyle();
          },
          immediate: true
        },
        color: {
          handler() {
            this.setIconStyle();
          },
          immediate: true
        },
        size: {
          handler() {
            this.setIconStyle();
          },
          immediate: true
        },
        style: {
          handler() {
            this.setIconStyle();
          },
          immediate: true
        }
      },
      methods: {
        onTap(t) {
          this.$emit("click", t);
        },
        setIconStyle() {
          const {
            name: name2,
            color,
            size,
            classPrefix
          } = this;
          const isImage = name2.indexOf("/") !== -1;
          const sizeValue = size !== null && size !== "" ? addUnit$1(size) : void 0;
          const colorStyle = color ? {
            color
          } : {};
          const fontStyle = size ? {
            "font-size": sizeValue
          } : {};
          const iconStyle = { ...colorStyle, ...fontStyle };
          this.isImage = isImage;
          if (isImage) {
            let iconSize = sizeValue;
            if (!iconSize) {
              getRect(this, `.${classPrefix}`).then((res) => {
                iconSize = addUnit$1(res == null ? void 0 : res.height);
              }).catch(() => {
              });
            }
            iconStyle.width = iconSize;
            iconStyle.height = iconSize;
          }
          this.iconStyle = `${styles(iconStyle)}`;
        }
      }
    })
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass([_ctx.tClass, _ctx.prefix || "t-icon"]),
      style: vue.normalizeStyle("" + _ctx.tools._style([_ctx.iconStyle, _ctx.customStyle])),
      "aria-hidden": _ctx.ariaHidden,
      "aria-label": _ctx.ariaLabel,
      "aria-role": _ctx.ariaRole,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onTap && _ctx.onTap(...args))
    }, [
      _ctx.isImage ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass(_ctx.classPrefix + "--image")
        },
        [
          vue.createElementVNode("image", {
            src: _ctx.name,
            mode: "aspectFit",
            class: vue.normalizeClass(_ctx.classPrefix + "__image")
          }, null, 10, ["src"])
        ],
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true),
      _ctx.tools.isValidIconName(_ctx.name) && !_ctx.isImage ? (vue.openBlock(), vue.createElementBlock(
        "div",
        {
          key: 1,
          class: vue.normalizeClass((_ctx.prefix ? _ctx.prefix : _ctx.classPrefix) + "-" + _ctx.name + " " + _ctx.classPrefix + "-base")
        },
        null,
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true)
    ], 14, ["aria-hidden", "aria-label", "aria-role"]);
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-04ed8512"], ["__file", "D:/mine/password-manage/node_modules/@tdesign/uniapp/dist/icon/icon.vue"]]);
  const props$2 = {
    /** 键盘弹起时，是否自动上推页面 */
    adjustPosition: {
      type: Boolean,
      default: true
    },
    /** 文本内容位置，居左/居中/居右 */
    align: {
      type: String,
      default: "left",
      validator(val) {
        if (!val)
          return true;
        return ["left", "center", "right"].includes(val);
      }
    },
    /** 超出 `maxlength` 或 `maxcharacter` 之后是否允许继续输入 */
    allowInputOverMax: Boolean,
    /** 强制 input 处于同层状态，默认 focus 时 input 会切到非同层状态 (仅在 iOS 下生效) */
    alwaysEmbed: Boolean,
    /** (即将废弃，请直接使用 focus )自动聚焦，拉起键盘 */
    autoFocus: Boolean,
    /** 是否开启无边框模式 */
    borderless: Boolean,
    /** 清空图标触发方式，仅在输入框有值时有效 */
    clearTrigger: {
      type: String,
      default: "always",
      validator(val) {
        if (!val)
          return true;
        return ["always", "focus"].includes(val);
      }
    },
    /** 是否可清空，默认不启动。值为 `true` 表示使用默认清空按钮，值为 `Object` 表示透传至 `icon` */
    clearable: {
      type: [Boolean, Object],
      default: false
    },
    /** 点击键盘右下角按钮时是否保持键盘不收起 */
    confirmHold: Boolean,
    /** 设置键盘右下角按钮的文字，仅在type='text'时生效。<br />具体释义：<br />`send` 右下角按钮为“发送”；<br />`search` 右下角按钮为“搜索”；<br />`next` 右下角按钮为“下一个”；<br />`go` 右下角按钮为“前往”；<br />`done` 右下角按钮为“完成”。<br />[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/input.html) */
    confirmType: {
      type: String,
      default: "done",
      validator(val) {
        if (!val)
          return true;
        return ["send", "search", "next", "go", "done"].includes(val);
      }
    },
    /** 指定 focus 时的光标位置 */
    cursor: {
      type: Number,
      default: -1
    },
    /** 光标颜色。iOS 下的格式为十六进制颜色值 #000000，安卓下的只支持 default 和 green，Skyline 下无限制 */
    cursorColor: {
      type: String,
      default: "#0052d9"
    },
    /** 指定光标与键盘的距离，取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离 */
    cursorSpacing: {
      type: Number,
      default: 0
    },
    /** 是否禁用输入框 */
    disabled: {
      type: [Boolean, null],
      default: null
    },
    /** 获取焦点 */
    focus: Boolean,
    /** 指定输入框展示值的格式 */
    format: {
      type: Function
    },
    /** focus时，点击页面的时候不收起键盘 */
    holdKeyboard: Boolean,
    /** 左侧文本 */
    label: {
      type: String
    },
    /** 标题输入框布局方式 */
    layout: {
      type: String,
      default: "horizontal",
      validator(val) {
        if (!val)
          return true;
        return ["vertical", "horizontal"].includes(val);
      }
    },
    /** 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度。`maxcharacter` 和 `maxlength` 二选一使用 */
    maxcharacter: {
      type: Number
    },
    /** 用户最多可以输入的文本长度，一个中文等于一个计数长度。默认为 -1，不限制输入长度。`maxcharacter` 和 `maxlength` 二选一使用 */
    maxlength: {
      type: Number,
      default: -1
    },
    /** 占位符 */
    placeholder: {
      type: [String, null],
      default: null
    },
    /** 指定 placeholder 的样式类 */
    placeholderClass: {
      type: String,
      default: "input-placeholder"
    },
    /** 指定 placeholder 的样式 */
    placeholderStyle: {
      type: String,
      default: ""
    },
    /** 组件前置图标。值为字符串表示图标名称，值为 `Object` 类型，表示透传至 `icon` */
    prefixIcon: {
      type: [String, Object]
    },
    /** 只读状态 */
    readonly: {
      type: [Boolean, null],
      default: null
    },
    /** 安全键盘加密公钥的路径，只支持包内路径 */
    safePasswordCertPath: {
      type: String,
      default: ""
    },
    /** 安全键盘计算 hash 的算法表达式，如 `md5(sha1('foo' + sha256(sm3(password + 'bar'))))` */
    safePasswordCustomHash: {
      type: String,
      default: ""
    },
    /** 安全键盘输入密码长度 */
    safePasswordLength: {
      type: Number
    },
    /** 安全键盘加密盐值 */
    safePasswordNonce: {
      type: String,
      default: ""
    },
    /** 安全键盘计算 hash 盐值，若指定custom-hash 则无效 */
    safePasswordSalt: {
      type: String,
      default: ""
    },
    /** 安全键盘加密时间戳 */
    safePasswordTimeStamp: {
      type: Number
    },
    /** 光标结束位置，自动聚集时有效，需与 selection-start 搭配使用 */
    selectionEnd: {
      type: Number,
      default: -1
    },
    /** 光标起始位置，自动聚集时有效，需与 selection-end 搭配使用 */
    selectionStart: {
      type: Number,
      default: -1
    },
    /** 输入框状态 */
    status: {
      type: String,
      default: "default",
      validator(val) {
        if (!val)
          return true;
        return ["default", "success", "warning", "error"].includes(val);
      }
    },
    /** 后置图标前的后置内容 */
    suffix: {
      type: String
    },
    /** 后置文本内容。值为字符串则表示图标名称，值为 `Object` 类型，表示透传至 `icon` */
    suffixIcon: {
      type: [String, Object]
    },
    /** 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式 */
    tips: {
      type: String
    },
    /** 输入框类型 */
    type: {
      type: String,
      default: "text",
      validator(val) {
        if (!val)
          return true;
        return ["text", "number", "idcard", "digit", "safe-password", "password", "nickname"].includes(val);
      }
    },
    /** 输入框的值 */
    value: {
      type: [String, Number]
    },
    /** 失去焦点时触发 */
    onBlur: {
      type: Function,
      default: () => ({})
    },
    /** 输入框值发生变化时触发；cursor 为光标位置； */
    onChange: {
      type: Function,
      default: () => ({})
    },
    /** 清空按钮点击时触发 */
    onClear: {
      type: Function,
      default: () => ({})
    },
    /** 点击事件。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/input/type.ts)。 */
    onClick: {
      type: Function,
      default: () => ({})
    },
    /** 回车键按下时触发 */
    onEnter: {
      type: Function,
      default: () => ({})
    },
    /** 获得焦点时触发 */
    onFocus: {
      type: Function,
      default: () => ({})
    },
    /** 键盘高度发生变化的时候触发此事件 */
    onKeyboardheightchange: {
      type: Function,
      default: () => ({})
    },
    /** 用户昵称审核完毕后触发，仅在 type 为 "nickname" 时有效 */
    onNicknamereview: {
      type: Function,
      default: () => ({})
    },
    /** 字数超出限制时触发 */
    onValidate: {
      type: Function,
      default: () => ({})
    }
  };
  function getInputClass(classPrefix, suffix, align, disabled) {
    const className = [`${classPrefix}__control`];
    if (align) {
      className.push(`${classPrefix}--${align}`);
    }
    if (disabled) {
      className.push(`${classPrefix}__control--disabled`);
    }
    return className.join(" ");
  }
  const RELATION_MAP = {
    CollapsePanel: "Collapse",
    TabPanel: "Tabs",
    StepItem: "Steps",
    TabBarItem: "TabBar",
    SideBarItem: "SideBar",
    GridItem: "Grid",
    DropdownItem: "DropdownMenu",
    Radio: "RadioGroup",
    Checkbox: "CheckboxGroup",
    Cell: "CellGroup",
    Avatar: "AvatarGroup",
    PickerItem: "Picker",
    IndexesAnchor: "Indexes",
    SwiperNav: "Swiper",
    Col: "Row",
    BackTop: "PullDownRefresh",
    FormItem: "Form",
    FormKey: "FormKey"
  };
  const name$2 = `${prefix}-input`;
  const _sfc_main$a = {
    components: {
      TIcon: __easycom_0$2
    },
    ...uniComponent({
      name: name$2,
      options: {
        styleIsolation: "shared"
      },
      inject: {
        [RELATION_MAP.FormKey]: {
          default: null
        }
      },
      externalClasses: [
        `${prefix}-class`,
        `${prefix}-class-prefix-icon`,
        `${prefix}-class-label`,
        `${prefix}-class-input`,
        `${prefix}-class-clearable`,
        `${prefix}-class-suffix`,
        `${prefix}-class-suffix-icon`,
        `${prefix}-class-tips`
      ],
      props: {
        ...props$2
      },
      emits: [
        "blur",
        "change",
        "clear",
        "click",
        "enter",
        "focus",
        "keyboardheightchange",
        "nicknamereview",
        "validate",
        "update:value"
      ],
      data() {
        return {
          prefix,
          classPrefix: name$2,
          classBasePrefix: prefix,
          showClearIcon: true,
          tools,
          dataValue: coalesce(this.value, this.defaultValue)
          // rawValue: '',
          // innerMaxLen: -1,
        };
      },
      watch: {
        prefixIcon: {
          handler(v) {
            this.iPrefixIcon = calcIcon(v);
          },
          immediate: true
        },
        suffixIcon: {
          handler(v) {
            this.iSuffixIcon = calcIcon(v);
          },
          immediate: true
        },
        clearable: {
          handler(v) {
            this.iClearIcon = calcIcon(v, "close-circle-filled");
          },
          immediate: true
        },
        clearTrigger: "updateClearIconVisible",
        disabled: "updateClearIconVisible",
        readonly: "updateClearIconVisible",
        value: {
          handler(v) {
            this.dataValue = v;
            nextTick().then(() => {
              this.dataValue = v;
              if (this[RELATION_MAP.FormKey] && this[RELATION_MAP.FormKey].onValueChange) {
                this[RELATION_MAP.FormKey].onValueChange(v);
              }
            });
          }
        }
      },
      mounted() {
        const { value, defaultValue } = this;
        this.updateValue(coalesce(value, defaultValue, ""));
        this.updateClearIconVisible();
      },
      methods: {
        getInputClass,
        updateValue(value) {
          this.dataValue = value;
          const { allowInputOverMax, maxcharacter, maxlength } = this;
          if (!allowInputOverMax && maxcharacter && maxcharacter > 0 && !Number.isNaN(maxcharacter)) {
            const { length, characters } = getCharacterLength("maxcharacter", value, maxcharacter);
            nextTick().then(() => {
              this.dataValue = characters;
            });
            this.count = length;
          } else if (!allowInputOverMax && maxlength && maxlength > 0 && !Number.isNaN(maxlength)) {
            const { length, characters } = getCharacterLength("maxlength", value, maxlength);
            nextTick().then(() => {
              this.dataValue = characters;
            });
            this.count = length;
          } else {
            nextTick().then(() => {
              this.dataValue = value;
            });
            this.dataValue = value;
            this.count = isDef(value) ? String(value).length : 0;
          }
        },
        // updateInnerMaxLen() {
        // this.innerMaxLen = this.getInnerMaxLen();
        // },
        // getInnerMaxLen() {
        //   const {
        //     allowInputOverMax,
        //     maxcharacter,
        //     maxlength,
        //     dataValue,
        //     rawValue,
        //     count,
        //   } = this;
        //   return getInnerMaxLen({
        //     allowInputOverMax,
        //     maxcharacter,
        //     maxlength,
        //     dataValue,
        //     rawValue,
        //     count,
        //   });
        // },
        updateClearIconVisible(value = false) {
          const { clearTrigger, disabled, readonly } = this;
          if (disabled || readonly) {
            this.showClearIcon = false;
            return;
          }
          this.showClearIcon = value || clearTrigger === "always";
        },
        onInput(e) {
          const { value, cursor, keyCode } = e.detail;
          this.updateValue(value);
          this.emitChange({ value: this.dataValue, cursor, keyCode });
        },
        onChange(e) {
          if (this.type !== "nickname")
            return;
          const { value } = e.detail;
          this.updateValue(value);
          this.emitChange({ value: this.dataValue });
        },
        emitChange(data) {
          this.$emit("change", data);
          this.$emit("update:value", data.value);
        },
        onFocus(e) {
          this.updateClearIconVisible(true);
          this.$emit("focus", e.detail);
        },
        onBlur(e) {
          this.updateClearIconVisible();
          if (this[RELATION_MAP.FormKey] && this[RELATION_MAP.FormKey].onBlur) {
            this[RELATION_MAP.FormKey].onBlur(this.dataValue);
          }
          if (typeof this.format === "function") {
            const v = this.format(e.detail.value);
            this.updateValue(v);
            this.$emit("blur", { value: this.dataValue, cursor: this.count });
            return;
          }
          this.$emit("blur", e.detail);
        },
        onConfirm(e) {
          this.$emit("enter", e.detail);
        },
        onSuffixClick() {
          this.$emit("click", { trigger: "suffix" });
        },
        onSuffixIconClick() {
          this.$emit("click", { trigger: "suffix-icon" });
        },
        clearInput(e) {
          this.$emit("clear", e.detail);
          this.dataValue = "";
        },
        onKeyboardHeightChange(e) {
          this.$emit("keyboardheightchange", e.detail);
        },
        onNickNameReview(e) {
          this.$emit("nicknamereview", e.detail);
        },
        onClick() {
          this.$emit("click", { trigger: "input" });
        }
      }
    })
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_t_icon = resolveEasycom(vue.resolveDynamicComponent("t-icon"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle("" + _ctx.tools._style([_ctx.customStyle])),
        class: vue.normalizeClass("" + _ctx.tools.cls(_ctx.classPrefix, [["border", !_ctx.borderless], ["readonly", _ctx.readonly], ["disabled", _ctx.disabled]]) + " " + _ctx.classPrefix + "--layout-" + _ctx.layout + " " + _ctx.tClass),
        "aria-describedby": ""
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(_ctx.classPrefix + "__wrap--prefix")
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(_ctx.classPrefix + "__icon--prefix")
              },
              [
                vue.renderSlot(_ctx.$slots, "prefix-icon", {}, void 0, true),
                _ctx.iPrefixIcon ? (vue.openBlock(), vue.createBlock(_component_t_icon, {
                  key: 0,
                  "custom-style": _ctx.iPrefixIcon.style || "",
                  "t-class": _ctx.tClassPrefixIcon,
                  prefix: _ctx.iPrefixIcon.prefix,
                  name: _ctx.iPrefixIcon.name,
                  size: _ctx.iPrefixIcon.size,
                  color: _ctx.iPrefixIcon.color,
                  "aria-hidden": true,
                  "aria-label": _ctx.iPrefixIcon.ariaLabel,
                  "aria-role": _ctx.iPrefixIcon.ariaRole,
                  onClick: _cache[0] || (_cache[0] = ($event) => _ctx.iPrefixIcon.click || "")
                }, null, 8, ["custom-style", "t-class", "prefix", "name", "size", "color", "aria-label", "aria-role"])) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(_ctx.classPrefix + "__label " + _ctx.tClassLabel),
                "aria-hidden": ""
              },
              [
                vue.renderSlot(_ctx.$slots, "label", {}, void 0, true),
                _ctx.label ? (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 0 },
                  [
                    vue.createTextVNode(
                      vue.toDisplayString(_ctx.label),
                      1
                      /* TEXT */
                    )
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            )
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(_ctx.classPrefix + "__wrap")
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(_ctx.classPrefix + "__content " + _ctx.classPrefix + "--" + _ctx.status),
                onClick: _cache[13] || (_cache[13] = (...args) => _ctx.onClick && _ctx.onClick(...args))
              },
              [
                vue.createElementVNode("input", {
                  class: vue.normalizeClass("" + _ctx.getInputClass(_ctx.classPrefix, _ctx.suffix, _ctx.align, _ctx.disabled) + " " + _ctx.tClassInput),
                  maxlength: _ctx.allowInputOverMax ? -1 : _ctx.maxlength,
                  disabled: _ctx.disabled || _ctx.readonly,
                  placeholder: _ctx.placeholder,
                  "placeholder-style": _ctx.placeholderStyle,
                  "placeholder-class": _ctx.tools.cls(_ctx.classPrefix + "__placeholder", [["disabled", _ctx.disabled]]) + " " + _ctx.placeholderClass,
                  value: _ctx.dataValue,
                  password: _ctx.type === "password",
                  type: _ctx.type === "password" ? "text" : _ctx.type,
                  focus: _ctx.focus,
                  "confirm-type": _ctx.confirmType,
                  "confirm-hold": _ctx.confirmHold,
                  cursor: _ctx.cursor,
                  "cursor-color": _ctx.cursorColor,
                  "cursor-spacing": _ctx.cursorSpacing,
                  "adjust-position": _ctx.adjustPosition,
                  "auto-focus": _ctx.autoFocus,
                  "always-embed": _ctx.alwaysEmbed,
                  "selection-start": _ctx.selectionStart,
                  "selection-end": _ctx.selectionEnd,
                  "hold-keyboard": _ctx.holdKeyboard,
                  "safe-password-cert-path": _ctx.safePasswordCertPath,
                  "safe-password-length": _ctx.safePasswordLength,
                  "safe-password-time-stamp": _ctx.safePasswordTimeStamp,
                  "safe-password-nonce": _ctx.safePasswordNonce,
                  "safe-password-salt": _ctx.safePasswordSalt,
                  "safe-password-custom-hash": _ctx.safePasswordCustomHash,
                  "aria-role": "textbox",
                  "aria-label": _ctx.label,
                  "aria-roledescription": _ctx.label,
                  onInput: _cache[1] || (_cache[1] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                  onChange: _cache[2] || (_cache[2] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
                  onFocus: _cache[3] || (_cache[3] = (...args) => _ctx.onFocus && _ctx.onFocus(...args)),
                  onBlur: _cache[4] || (_cache[4] = (...args) => _ctx.onBlur && _ctx.onBlur(...args)),
                  onConfirm: _cache[5] || (_cache[5] = (...args) => _ctx.onConfirm && _ctx.onConfirm(...args)),
                  onKeyboardheightchange: _cache[6] || (_cache[6] = (...args) => _ctx.onKeyboardHeightChange && _ctx.onKeyboardHeightChange(...args)),
                  onNicknamereview: _cache[7] || (_cache[7] = (...args) => _ctx.onNickNameReview && _ctx.onNickNameReview(...args))
                }, null, 42, ["maxlength", "disabled", "placeholder", "placeholder-style", "placeholder-class", "value", "password", "type", "focus", "confirm-type", "confirm-hold", "cursor", "cursor-color", "cursor-spacing", "adjust-position", "auto-focus", "always-embed", "selection-start", "selection-end", "hold-keyboard", "safe-password-cert-path", "safe-password-length", "safe-password-time-stamp", "safe-password-nonce", "safe-password-salt", "safe-password-custom-hash", "aria-label", "aria-roledescription"]),
                _ctx.iClearIcon && _ctx.dataValue && _ctx.dataValue.length && _ctx.showClearIcon ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: vue.normalizeClass(_ctx.classPrefix + "__wrap--clearable-icon"),
                    onClick: _cache[9] || (_cache[9] = vue.withModifiers((...args) => _ctx.clearInput && _ctx.clearInput(...args), ["stop"]))
                  },
                  [
                    vue.createVNode(_component_t_icon, {
                      "custom-style": _ctx.iClearIcon.style || "",
                      "t-class": _ctx.tClassClearable,
                      prefix: _ctx.iClearIcon.prefix,
                      name: _ctx.iClearIcon.name,
                      size: _ctx.iClearIcon.size,
                      color: _ctx.iClearIcon.color,
                      "aria-hidden": false,
                      "aria-label": _ctx.iClearIcon.ariaLabel || "清除",
                      "aria-role": _ctx.iClearIcon.ariaRole || "button",
                      onClick: _cache[8] || (_cache[8] = ($event) => _ctx.iClearIcon.click || "")
                    }, null, 8, ["custom-style", "t-class", "prefix", "name", "size", "color", "aria-label", "aria-role"])
                  ],
                  2
                  /* CLASS */
                )) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(_ctx.classPrefix + "__wrap--suffix " + _ctx.tClassSuffix),
                    onClick: _cache[10] || (_cache[10] = (...args) => _ctx.onSuffixClick && _ctx.onSuffixClick(...args))
                  },
                  [
                    _ctx.suffix ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      { key: 0 },
                      vue.toDisplayString(_ctx.suffix),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true),
                    vue.renderSlot(_ctx.$slots, "suffix", {}, void 0, true)
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(_ctx.classPrefix + "__wrap--suffix-icon"),
                    onClick: _cache[12] || (_cache[12] = (...args) => _ctx.onSuffixIconClick && _ctx.onSuffixIconClick(...args))
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "suffix-icon", {}, void 0, true),
                    _ctx.iSuffixIcon ? (vue.openBlock(), vue.createBlock(_component_t_icon, {
                      key: 0,
                      "custom-style": _ctx.iSuffixIcon.style || "",
                      "t-class": _ctx.tClassSuffixIcon,
                      prefix: _ctx.iSuffixIcon.prefix,
                      name: _ctx.iSuffixIcon.name,
                      size: _ctx.iSuffixIcon.size,
                      color: _ctx.iSuffixIcon.color,
                      "aria-hidden": true,
                      "aria-label": _ctx.iSuffixIcon.ariaLabel,
                      "aria-role": _ctx.iSuffixIcon.ariaRole || "button",
                      onClick: _cache[11] || (_cache[11] = ($event) => _ctx.iSuffixIcon.click || "")
                    }, null, 8, ["custom-style", "t-class", "prefix", "name", "size", "color", "aria-label", "aria-role"])) : vue.createCommentVNode("v-if", true)
                  ],
                  2
                  /* CLASS */
                )
              ],
              2
              /* CLASS */
            ),
            _ctx.tips && _ctx.tips.length > 0 ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: vue.normalizeClass(_ctx.classPrefix + "__tips " + _ctx.classPrefix + "--" + _ctx.align + " " + _ctx.tClassTips)
              },
              vue.toDisplayString(_ctx.tips),
              3
              /* TEXT, CLASS */
            )) : vue.createCommentVNode("v-if", true),
            vue.renderSlot(_ctx.$slots, "tips", {}, void 0, true)
          ],
          2
          /* CLASS */
        ),
        vue.renderSlot(_ctx.$slots, "extra", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-990e691b"], ["__file", "D:/mine/password-manage/node_modules/@tdesign/uniapp/dist/input/input.vue"]]);
  const props$1 = {
    /** 延迟显示加载效果的时间，用于防止请求速度过快引起的加载闪烁，单位：毫秒 */
    delay: {
      type: Number,
      default: 0
    },
    /** 加载动画执行完成一次的时间，单位：毫秒 */
    duration: {
      type: Number,
      default: 800
    },
    /** 是否显示为全屏加载 */
    fullscreen: Boolean,
    /** 加载指示符，值为 true 显示默认指示符，值为 false 则不显示，也可以自定义指示符 */
    indicator: {
      type: Boolean,
      default: true
    },
    /** 是否继承父元素颜色 */
    inheritColor: Boolean,
    /** 对齐方式 */
    layout: {
      type: String,
      default: "horizontal",
      validator(val) {
        if (!val)
          return true;
        return ["horizontal", "vertical"].includes(val);
      }
    },
    /** 是否处于加载状态 */
    loading: {
      type: Boolean,
      default: true
    },
    /** 是否暂停动画 */
    pause: Boolean,
    /** 加载进度 */
    progress: {
      type: Number
    },
    /** 加载动画是否反向 */
    reverse: Boolean,
    /** 尺寸，示例：20px */
    size: {
      type: String,
      default: "20px"
    },
    /** 加载提示文案 */
    text: {
      type: String
    },
    /** 加载组件类型 */
    theme: {
      type: String,
      default: "circular",
      validator(val) {
        if (!val)
          return true;
        return ["circular", "spinner", "dots", "custom"].includes(val);
      }
    }
  };
  const name$1 = `${prefix}-loading`;
  const _sfc_main$9 = {
    ...uniComponent({
      name: name$1,
      options: {
        multipleSlots: true,
        styleIsolation: "shared"
      },
      externalClasses: [
        `${prefix}-class`,
        `${prefix}-class-text`,
        `${prefix}-class-indicator`
      ],
      props: {
        ...props$1
      },
      data() {
        return {
          prefix,
          classPrefix: name$1,
          show: true,
          tools
        };
      },
      watch: {
        loading: {
          handler(value) {
            const {
              delay
            } = this;
            if (this.timer) {
              clearTimeout(this.timer);
            }
            if (value && delay) {
              this.timer = setTimeout(() => {
                this.show = value;
                this.timer = null;
              }, delay);
            } else {
              this.show = value;
            }
          },
          immediate: true
        }
      },
      beforeUnmount() {
        clearTimeout(this.timer);
      },
      methods: {
        refreshPage() {
          this.$emit("reload");
        }
      }
    })
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle("" + _ctx.tools._style([
          _ctx.customStyle,
          _ctx.show ? "" : "display: none",
          _ctx.inheritColor ? "color: inherit" : ""
        ])),
        class: vue.normalizeClass([
          _ctx.tClass,
          _ctx.classPrefix + " " + (_ctx.classPrefix + "--" + _ctx.layout) + " " + (_ctx.fullscreen ? _ctx.classPrefix + "--fullscreen" : "")
        ])
      },
      [
        _ctx.indicator ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: vue.normalizeClass([
            _ctx.tClassIndicator,
            _ctx.classPrefix + "__spinner " + _ctx.classPrefix + "__spinner--" + _ctx.theme + " " + (_ctx.reverse ? "reverse" : "")
          ]),
          style: vue.normalizeStyle("width: " + _ctx.tools.addUnit(_ctx.size) + "; height: " + _ctx.tools.addUnit(_ctx.size) + "; " + (_ctx.inheritColor ? "color: inherit;" : "") + " " + (_ctx.indicator ? "" : "display: none;") + " " + (_ctx.duration ? "animation-duration: " + _ctx.duration / 1e3 + "s;" : "") + " animation-play-state: " + (_ctx.pause ? "paused" : "running") + ";"),
          "aria-role": _ctx.ariaRole || "img",
          "aria-label": _ctx.ariaLabel || _ctx.text || "加载中"
        }, [
          _ctx.theme === "spinner" ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            vue.renderList(12, (item, index) => {
              return vue.createElementVNode(
                "view",
                {
                  key: index,
                  class: vue.normalizeClass(_ctx.classPrefix + "__dot " + _ctx.classPrefix + "__dot-" + index)
                },
                null,
                2
                /* CLASS */
              );
            }),
            64
            /* STABLE_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          _ctx.theme === "circular" ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 1,
              class: vue.normalizeClass(_ctx.classPrefix + "__circular")
            },
            null,
            2
            /* CLASS */
          )) : vue.createCommentVNode("v-if", true),
          _ctx.theme === "dots" ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 2 },
            [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(_ctx.classPrefix + "__dot"),
                  style: vue.normalizeStyle(
                    (_ctx.duration ? "animation-duration: " + _ctx.duration / 1e3 + "s; animation-delay:0s;" : "") + " animation-play-state: " + (_ctx.pause ? "paused" : "running") + ";"
                  )
                },
                null,
                6
                /* CLASS, STYLE */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(_ctx.classPrefix + "__dot"),
                  style: vue.normalizeStyle(
                    (_ctx.duration ? "animation-duration: " + _ctx.duration / 1e3 + "s; animation-delay:" + _ctx.duration * 1 / 3e3 + "s;" : "") + " animation-play-state: " + (_ctx.pause ? "paused" : "running") + ";"
                  )
                },
                null,
                6
                /* CLASS, STYLE */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(_ctx.classPrefix + "__dot"),
                  style: vue.normalizeStyle(
                    (_ctx.duration ? "animation-duration: " + _ctx.duration / 1e3 + "s; animation-delay:" + _ctx.duration * 2 / 3e3 + "s;" : "") + " animation-play-state: " + (_ctx.pause ? "paused" : "running") + ";"
                  )
                },
                null,
                6
                /* CLASS, STYLE */
              )
            ],
            64
            /* STABLE_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "indicator", {}, void 0, true)
        ], 14, ["aria-role", "aria-label"])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["" + _ctx.tools.cls(_ctx.classPrefix + "__text", [_ctx.layout]), _ctx.tClassText]),
          "aria-hidden": _ctx.indicator,
          "aria-label": _ctx.ariaLabel || _ctx.text
        }, [
          _ctx.text ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            [
              vue.createTextVNode(
                vue.toDisplayString(_ctx.text),
                1
                /* TEXT */
              )
            ],
            64
            /* STABLE_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "text", {}, void 0, true),
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ], 10, ["aria-hidden", "aria-label"])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-1b9177fb"], ["__file", "D:/mine/password-manage/node_modules/@tdesign/uniapp/dist/loading/loading.vue"]]);
  const props = {
    /** 卡片id。 `open-type` 的值设置为 `liveActivity` ，设置 `activity-type` 参数为 [notify_type](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message-2.html)。当用户点击 `button` 后，可以通过 `bindcreateliveactivity` 事件回调获取到 `code`  */
    activityType: {
      type: Number
    },
    /** 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效 */
    appParameter: {
      type: String,
      default: ""
    },
    /** 是否为块级元素 */
    block: Boolean,
    /** 按钮内容 */
    content: {
      type: String
    },
    /** 自定义 dataset，可通过 event.currentTarget.dataset.custom 获取 */
    customDataset: {
      type: [String, Number, Boolean, Object, Array],
      default: () => ({})
    },
    /** 禁用状态。优先级：Button.disabled > Form.disabled */
    disabled: {
      type: [Boolean, null],
      default: null
    },
    /** 从消息小程序入口打开小程序的路径，默认为聊天工具启动路径 */
    entrancePath: {
      type: String,
      default: ""
    },
    /** 是否为幽灵按钮（镂空按钮） */
    ghost: Boolean,
    /** 指定按钮按下去的样式类，按钮不为加载或禁用状态时有效。当 `hover-class="none"` 时，没有点击态效果 */
    hoverClass: {
      type: String,
      default: ""
    },
    /** 按住后多久出现点击态，单位毫秒 */
    hoverStartTime: {
      type: Number,
      default: 20
    },
    /** 手指松开后点击态保留时间，单位毫秒 */
    hoverStayTime: {
      type: Number,
      default: 70
    },
    /** 指定是否阻止本节点的祖先节点出现点击态 */
    hoverStopPropagation: Boolean,
    /** 图标名称。值为字符串表示图标名称，值为 `Object` 类型，表示透传至 `icon` */
    icon: {
      type: [String, Object]
    },
    /** 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。<br />具体释义：<br />`en` 英文；<br />`zh_CN` 简体中文；<br />`zh_TW` 繁体中文。<br />[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) */
    lang: {
      type: String,
      validator(val) {
        if (!val)
          return true;
        return ["en", "zh_CN", "zh_TW"].includes(val);
      }
    },
    /** 是否显示为加载状态 */
    loading: Boolean,
    /** 透传 Loading 组件全部属性 */
    loadingProps: {
      type: Object,
      default: () => ({})
    },
    /** 转发的文本消息是否要带小程序入口 */
    needShowEntrance: {
      type: Boolean,
      default: true
    },
    /** 微信开放能力。<br />具体释义：<br />`contact` 打开客服会话，如果用户在会话中点击消息卡片后返回小程序，可以从 bindcontact 回调中获得具体信息，<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/customer-message/customer-message.html">具体说明</a> （*鸿蒙 OS 暂不支持*）；<br />`liveActivity` 通过前端获取<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message-2.html">新的一次性订阅消息下发机制</a>使用的 code；<br />`share` 触发用户转发，使用前建议先阅读<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html#使用指引">使用指引</a>；<br />`getPhoneNumber` 获取用户手机号，可以从 bindgetphonenumber 回调中获取到用户信息，<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html">具体说明</a> （*小程序插件中不能使用*）；<br />`getUserInfo` 获取用户信息，可以从 bindgetuserinfo 回调中获取到用户信息 （*小程序插件中不能使用*）；<br />`launchApp` 打开APP，可以通过 app-parameter 属性设定向 APP 传的参数<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/launchApp.html">具体说明</a>；<br />`openSetting` 打开授权设置页；<br />`feedback` 打开“意见反馈”页面，用户可提交反馈内容并上传<a href="https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.getLogManager.html">日志</a>，开发者可以登录<a href="https://mp.weixin.qq.com/">小程序管理后台</a>后进入左侧菜单“客服反馈”页面获取到反馈内容；<br />`chooseAvatar` 获取用户头像，可以从 bindchooseavatar 回调中获取到头像信息；<br />`agreePrivacyAuthorization`用户同意隐私协议按钮。用户点击一次此按钮后，所有隐私接口可以正常调用。可通过`bindagreeprivacyauthorization`监听用户同意隐私协议事件。隐私合规开发指南详情可见《<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/PrivacyAuthorize.html">小程序隐私协议开发指南</a>》。<br />[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) */
    openType: {
      type: String,
      validator(val) {
        if (!val)
          return true;
        return ["contact", "share", "getPhoneNumber", "getUserInfo", "launchApp", "openSetting", "feedback", "chooseAvatar", "agreePrivacyAuthorization"].includes(val);
      }
    },
    /** 原生按钮属性，当手机号快速验证或手机号实时验证额度用尽时，是否对用户展示“申请获取你的手机号，但该功能使用次数已达当前小程序上限，暂时无法使用”的提示，默认展示，open-type="getPhoneNumber" 或 open-type="getRealtimePhoneNumber" 时有效 */
    phoneNumberNoQuotaToast: {
      type: Boolean,
      default: true
    },
    /** 会话内消息卡片图片，open-type="contact"时有效 */
    sendMessageImg: {
      type: String,
      default: "截图"
    },
    /** 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效 */
    sendMessagePath: {
      type: String,
      default: "当前分享路径"
    },
    /** 会话内消息卡片标题，open-type="contact"时有效 */
    sendMessageTitle: {
      type: String,
      default: "当前标题"
    },
    /** 会话来源，open-type="contact"时有效 */
    sessionFrom: {
      type: String,
      default: ""
    },
    /** 按钮形状，有 4 种：长方形、正方形、圆角长方形、圆形 */
    shape: {
      type: String,
      default: "rectangle",
      validator(val) {
        if (!val)
          return true;
        return ["rectangle", "square", "round", "circle"].includes(val);
      }
    },
    /** 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，open-type="contact"时有效 */
    showMessageCard: Boolean,
    /** 组件尺寸 */
    size: {
      type: String,
      default: "medium",
      validator(val) {
        if (!val)
          return true;
        return ["extra-small", "small", "medium", "large"].includes(val);
      }
    },
    /** 按钮标签id */
    tId: {
      type: String,
      default: ""
    },
    /** 组件风格，依次为品牌色、危险色 */
    theme: {
      type: String,
      default: "default",
      validator(val) {
        if (!val)
          return true;
        return ["default", "primary", "danger", "light"].includes(val);
      }
    },
    /** 同小程序的 formType */
    type: {
      type: String,
      validator(val) {
        if (!val)
          return true;
        return ["submit", "reset"].includes(val);
      }
    },
    /** 按钮形式，基础、线框、虚线、文字 */
    variant: {
      type: String,
      default: "base",
      validator(val) {
        if (!val)
          return true;
        return ["base", "outline", "dashed", "text"].includes(val);
      }
    },
    /** 原生按钮属性，用户同意隐私协议事件回调，open-type=agreePrivacyAuthorization时有效 （Tips: 如果使用 onNeedPrivacyAuthorization 接口，需要在 bindagreeprivacyauthorization 触发后再调用 resolve({ event: "agree", buttonId })） */
    onAgreeprivacyauthorization: {
      type: Function,
      default: () => ({})
    },
    /** 原生按钮属性，获取用户头像回调，`open-type=chooseAvatar` 时有效。返回 `e.detail.avatarUrl` 为头像临时文件链接 */
    onChooseavatar: {
      type: Function,
      default: () => ({})
    },
    /** 点击时触发 */
    onClick: {
      type: Function,
      default: () => ({})
    },
    /** 原生按钮属性，客服消息回调，`open-type="contact"` 时有效 */
    onContact: {
      type: Function,
      default: () => ({})
    },
    /** 新的一次性订阅消息下发机制回调，`open-type=liveActivity` 时有效 */
    onCreateliveactivity: {
      type: Function,
      default: () => ({})
    },
    /** 原生按钮属性，当使用开放能力时，发生错误的回调，`open-type=launchApp` 时有效 */
    onError: {
      type: Function,
      default: () => ({})
    },
    /** 原生按钮属性，手机号快速验证回调，open-type=getPhoneNumber时有效。Tips：在触发 bindgetphonenumber 回调后应立即隐藏手机号按钮组件，或置为 disabled 状态，避免用户重复授权手机号产生额外费用 */
    onGetphonenumber: {
      type: Function,
      default: () => ({})
    },
    /** 原生按钮属性，手机号实时验证回调，open-type=getRealtimePhoneNumber 时有效。Tips：在触发 bindgetrealtimephonenumber 回调后应立即隐藏手机号按钮组件，或置为 disabled 状态，避免用户重复授权手机号产生额外费用 */
    onGetrealtimephonenumber: {
      type: Function,
      default: () => ({})
    },
    /** 原生按钮属性，用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与wx.getUserInfo返回的一致，open-type="getUserInfo"时有效 */
    onGetuserinfo: {
      type: Function,
      default: () => ({})
    },
    /** 打开 APP 成功的回调，`open-type=launchApp` 时有效 */
    onLaunchapp: {
      type: Function,
      default: () => ({})
    },
    /** 原生按钮属性，在打开授权设置页后回调，open-type=openSetting时有效 */
    onOpensetting: {
      type: Function,
      default: () => ({})
    }
  };
  const name = `${prefix}-button`;
  const _sfc_main$8 = {
    components: {
      TIcon: __easycom_0$2,
      TLoading: __easycom_1
    },
    ...uniComponent({
      name,
      options: {
        styleIsolation: "shared"
      },
      externalClasses: [
        `${prefix}-class`,
        `${prefix}-class-icon`,
        `${prefix}-class-loading`
      ],
      props: {
        ...props
      },
      emits: [
        "click"
      ],
      data() {
        return {
          tools,
          prefix,
          className: "",
          classPrefix: name,
          innerIcon: void 0
        };
      },
      computed: {
        iconCustomStyle() {
          if (!this.innerIcon) {
            return {};
          }
          const fontSize = {
            "extra-small": "var(--td-button-extra-small-icon-font-size, 18px)",
            small: "var(--td-button-small-icon-font-size, 18px)",
            medium: "var(--td-button-medium-icon-font-size, 20px)",
            large: "var(--td-button-large-icon-font-size, 24px)"
          };
          return tools._style([
            {
              fontSize: this.innerIcon.size ? addUnit$1(this.innerIcon.size) : fontSize[this.size || "medium"],
              borderRadius: "var(--td-button-icon-border-radius, 4px)"
            },
            this.innerIcon.style || ""
          ]);
        },
        loadingCustomStyle() {
          return tools._style({
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          });
        }
      },
      watch: {
        icon: {
          handler(value) {
            this.innerIcon = calcIcon(value, "");
          },
          immediate: true
        },
        theme: "setClass",
        size: "setClass",
        plain: "setClass",
        block: "setClass",
        shape: "setClass",
        disabled: "setClass",
        loading: "setClass",
        variant: "setClass"
      },
      created() {
        this.setClass();
      },
      methods: {
        setClass() {
          const t = [
            name,
            this.tClass,
            `${name}--${this.variant || "base"}`,
            `${name}--${this.theme || "default"}`,
            `${name}--${this.shape || "rectangle"}`,
            `${name}--size-${this.size || "medium"}`
          ];
          if (this.block) {
            t.push(`${name}--block`);
          }
          if (this.disabled) {
            t.push(`${name}--disabled`);
          }
          if (this.ghost) {
            t.push(`${name}--ghost`);
          }
          this.className = t.join(" ");
        },
        getuserinfo(t) {
          this.$emit("getuserinfo", t);
        },
        contact(t) {
          this.$emit("contact", t);
        },
        getphonenumber(t) {
          this.$emit("getphonenumber", t);
        },
        error(t) {
          this.$emit("error", t);
        },
        opensetting(t) {
          this.$emit("opensetting", t);
        },
        launchapp(t) {
          this.$emit("launchapp", t);
        },
        chooseavatar(t) {
          this.$emit("chooseavatar", t);
        },
        agreeprivacyauthorization(t) {
          this.$emit("agreeprivacyauthorization", t);
        },
        handleTap(t) {
          if (this.disabled || this.loading)
            return;
          this.$emit("click", t);
        }
      }
    })
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_t_icon = resolveEasycom(vue.resolveDynamicComponent("t-icon"), __easycom_0$2);
    const _component_t_loading = resolveEasycom(vue.resolveDynamicComponent("t-loading"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("button", {
      id: _ctx.tId,
      style: vue.normalizeStyle("" + _ctx.tools._style([_ctx.customStyle])),
      "data-custom": _ctx.customDataset,
      class: vue.normalizeClass(_ctx.className),
      "activity-type": _ctx.activityType ? _ctx.activityType : "",
      "entrance-path": _ctx.entrancePath,
      "form-type": _ctx.disabled || _ctx.loading ? "" : _ctx.type,
      "open-type": _ctx.disabled || _ctx.loading ? "" : _ctx.openType,
      "hover-stop-propagation": _ctx.hoverStopPropagation,
      "hover-start-time": _ctx.hoverStartTime,
      "hover-stay-time": _ctx.hoverStayTime,
      lang: _ctx.lang,
      "need-show-entrance": _ctx.needShowEntrance,
      "session-from": _ctx.sessionFrom,
      "hover-class": _ctx.disabled || _ctx.loading ? "" : _ctx.hoverClass || _ctx.classPrefix + "--hover",
      "send-message-title": _ctx.sendMessageTitle,
      "send-message-path": _ctx.sendMessagePath,
      "send-message-img": _ctx.sendMessageImg,
      "app-parameter": _ctx.appParameter,
      "show-message-card": _ctx.showMessageCard,
      "aria-label": _ctx.ariaLabel,
      onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => _ctx.handleTap && _ctx.handleTap(...args), ["stop", "prevent"])),
      onGetuserinfo: _cache[1] || (_cache[1] = (...args) => _ctx.getuserinfo && _ctx.getuserinfo(...args)),
      onContact: _cache[2] || (_cache[2] = (...args) => _ctx.contact && _ctx.contact(...args)),
      onGetphonenumber: _cache[3] || (_cache[3] = (...args) => _ctx.getphonenumber && _ctx.getphonenumber(...args)),
      onError: _cache[4] || (_cache[4] = (...args) => _ctx.error && _ctx.error(...args)),
      onOpensetting: _cache[5] || (_cache[5] = (...args) => _ctx.opensetting && _ctx.opensetting(...args)),
      onLaunchapp: _cache[6] || (_cache[6] = (...args) => _ctx.launchapp && _ctx.launchapp(...args)),
      onChooseavatar: _cache[7] || (_cache[7] = (...args) => _ctx.chooseavatar && _ctx.chooseavatar(...args)),
      onAgreeprivacyauthorization: _cache[8] || (_cache[8] = (...args) => _ctx.agreeprivacyauthorization && _ctx.agreeprivacyauthorization(...args))
    }, [
      _ctx.innerIcon ? (vue.openBlock(), vue.createBlock(_component_t_icon, {
        key: 0,
        "custom-style": _ctx.iconCustomStyle,
        "t-class": _ctx.classPrefix + "__icon " + _ctx.classPrefix + "__icon--" + (_ctx.innerIcon.activeIdx == _ctx.innerIcon.index ? "active " : " ") + _ctx.tClassIcon,
        prefix: _ctx.innerIcon.prefix,
        name: _ctx.innerIcon.name || "",
        size: _ctx.innerIcon.size,
        color: _ctx.innerIcon.color,
        onClick: ($event) => "handleClose"
      }, null, 8, ["custom-style", "t-class", "prefix", "name", "size", "color"])) : vue.createCommentVNode("v-if", true),
      _ctx.loading ? (vue.openBlock(), vue.createBlock(_component_t_loading, {
        key: 1,
        delay: _ctx.loadingProps.delay || 0,
        duration: _ctx.loadingProps.duration || 800,
        indicator: _ctx.loadingProps.indicator || true,
        "inherit-color": _ctx.loadingProps.inheritColor || true,
        layout: _ctx.loadingProps.layout || "horizontal",
        pause: _ctx.loadingProps.pause || false,
        progress: _ctx.loadingProps.progress || 0,
        reverse: _ctx.loadingProps.reverse || false,
        size: _ctx.loadingProps.size || "40rpx",
        text: _ctx.loadingProps.text || "",
        theme: _ctx.loadingProps.theme || "circular",
        loading: "",
        "t-class": _ctx.classPrefix + "__loading " + _ctx.classPrefix + "__loading--wrapper",
        "t-class-indicator": _ctx.classPrefix + "__loading--indicator " + _ctx.tClassLoading,
        "custom-style": _ctx.loadingCustomStyle
      }, null, 8, ["delay", "duration", "indicator", "inherit-color", "layout", "pause", "progress", "reverse", "size", "text", "theme", "t-class", "t-class-indicator", "custom-style"])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(_ctx.classPrefix + "__content " + ((_ctx.innerIcon && _ctx.innerIcon.name || _ctx.loading) && _ctx.content ? _ctx.classPrefix + "__content--has-icon" : ""))
        },
        [
          vue.renderSlot(_ctx.$slots, "content", {}, void 0, true),
          _ctx.content ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            [
              vue.createTextVNode(
                vue.toDisplayString(_ctx.content),
                1
                /* TEXT */
              )
            ],
            64
            /* STABLE_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        2
        /* CLASS */
      ),
      vue.renderSlot(_ctx.$slots, "suffix", {}, void 0, true)
    ], 46, ["id", "data-custom", "activity-type", "entrance-path", "form-type", "open-type", "hover-stop-propagation", "hover-start-time", "hover-stay-time", "lang", "need-show-entrance", "session-from", "hover-class", "send-message-title", "send-message-path", "send-message-img", "app-parameter", "show-message-card", "aria-label"]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-38be560e"], ["__file", "D:/mine/password-manage/node_modules/@tdesign/uniapp/dist/button/button.vue"]]);
  const DB_NAME = "password_manage.db";
  const DB_PATH = "_doc/password_manage.db";
  let opened = false;
  function escapeSqlValue(value) {
    if (value === null || value === void 0) {
      return "NULL";
    }
    if (typeof value === "number") {
      return Number.isFinite(value) ? String(value) : "NULL";
    }
    if (typeof value === "boolean") {
      return value ? "1" : "0";
    }
    const text = String(value).replace(/'/g, "''");
    return `'${text}'`;
  }
  function compileSql(sql, params = []) {
    if (!Array.isArray(params) || params.length === 0) {
      return sql;
    }
    let index = 0;
    return String(sql).replace(/\?/g, () => {
      const current = index < params.length ? params[index] : null;
      index += 1;
      return escapeSqlValue(current);
    });
  }
  function assertSqliteAvailable() {
    if (typeof plus === "undefined" || !plus.sqlite) {
      throw new Error("当前环境不支持 SQLite，请在 uni-app App 端运行。");
    }
  }
  async function openDatabase() {
    if (opened) {
      return;
    }
    assertSqliteAvailable();
    const isOpen = plus.sqlite.isOpenDatabase({
      name: DB_NAME,
      path: DB_PATH
    });
    if (!isOpen) {
      await new Promise((resolve, reject) => {
        plus.sqlite.openDatabase({
          name: DB_NAME,
          path: DB_PATH,
          success: () => resolve(),
          fail: (error) => reject(error)
        });
      });
    }
    opened = true;
  }
  async function executeSql(sql, params = []) {
    await openDatabase();
    const finalSql = compileSql(sql, params);
    return new Promise((resolve, reject) => {
      plus.sqlite.executeSql({
        name: DB_NAME,
        sql: finalSql,
        success: () => resolve(),
        fail: (error) => reject(error)
      });
    });
  }
  async function selectSql(sql, params = []) {
    await openDatabase();
    const finalSql = compileSql(sql, params);
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name: DB_NAME,
        sql: finalSql,
        success: (data) => resolve(data || []),
        fail: (error) => reject(error)
      });
    });
  }
  const CREATE_PASSWORD_ITEMS_SQL = `
CREATE TABLE IF NOT EXISTS password_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  account TEXT NOT NULL,
  password TEXT NOT NULL,
  url TEXT DEFAULT '',
  note TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  category_id INTEGER DEFAULT 0,
  tags TEXT DEFAULT '[]',
  is_favorite INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
`;
  const CREATE_CATEGORIES_SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
)
`;
  const CREATE_SETTINGS_SQL = `
CREATE TABLE IF NOT EXISTS app_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL
)
`;
  const DEFAULT_CATEGORIES = ["社交", "工作", "银行", "其他"];
  async function initDatabase() {
    await executeSql(CREATE_PASSWORD_ITEMS_SQL);
    await executeSql(CREATE_CATEGORIES_SQL);
    await executeSql(CREATE_SETTINGS_SQL);
    for (let i = 0; i < DEFAULT_CATEGORIES.length; i += 1) {
      await executeSql(
        "INSERT OR IGNORE INTO categories (name, sort_order) VALUES (?, ?)",
        [DEFAULT_CATEGORIES[i], i + 1]
      );
    }
  }
  async function getSetting(key) {
    const rows = await selectSql(
      "SELECT setting_value FROM app_settings WHERE setting_key = ? LIMIT 1",
      [key]
    );
    return rows.length ? rows[0].setting_value : "";
  }
  async function setSetting(key, value) {
    await executeSql("INSERT OR REPLACE INTO app_settings (setting_key, setting_value) VALUES (?, ?)", [
      key,
      String(value)
    ]);
  }
  async function hasLockPassword() {
    const value = await getSetting("lock_password");
    return !!value;
  }
  async function verifyLockPassword(encodedPassword) {
    const current = await getSetting("lock_password");
    if (!current) {
      return false;
    }
    return current === encodedPassword;
  }
  const state = vue.reactive({
    unlocked: false
  });
  function useLockStore() {
    function setUnlocked(value) {
      state.unlocked = !!value;
    }
    return {
      state,
      setUnlocked
    };
  }
  const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function utf8Encode(input) {
    return unescape(encodeURIComponent(input));
  }
  function base64Encode(str) {
    let output = "";
    let i = 0;
    const source = utf8Encode(str);
    while (i < source.length) {
      const chr1 = source.charCodeAt(i++);
      const chr2 = source.charCodeAt(i++);
      const chr3 = source.charCodeAt(i++);
      const enc1 = chr1 >> 2;
      const enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      let enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      let enc4 = chr3 & 63;
      if (Number.isNaN(chr2)) {
        enc3 = 64;
        enc4 = 64;
      } else if (Number.isNaN(chr3)) {
        enc4 = 64;
      }
      output += BASE64_CHARS.charAt(enc1);
      output += BASE64_CHARS.charAt(enc2);
      output += enc3 === 64 ? "=" : BASE64_CHARS.charAt(enc3);
      output += enc4 === 64 ? "=" : BASE64_CHARS.charAt(enc4);
    }
    return output;
  }
  function encodeLockPassword(rawPassword) {
    const safeValue = String(rawPassword || "").trim();
    return base64Encode(`local-lock:${safeValue}`);
  }
  function validateLockPassword(password) {
    const safeValue = String(password || "").trim();
    if (![4, 6].includes(safeValue.length)) {
      return "启动密码必须是4位或6位";
    }
    if (!/^\d+$/.test(safeValue)) {
      return "启动密码必须是纯数字";
    }
    return "";
  }
  function validatePasswordItemForm(form) {
    const errors = {};
    if (!String(form.name || "").trim()) {
      errors.name = "名称必填";
    }
    if (!String(form.account || "").trim()) {
      errors.account = "账号必填";
    }
    if (!String(form.password || "").trim()) {
      errors.password = "密码必填";
    }
    return errors;
  }
  function validateImportJson(data) {
    if (!Array.isArray(data)) {
      throw new Error("导入数据必须是数组");
    }
    data.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        throw new Error(`第 ${index + 1} 条不是对象`);
      }
      if (!item.name || !item.account || !item.password) {
        throw new Error(`第 ${index + 1} 条缺少必填字段 name/account/password`);
      }
      if (item.tags && !Array.isArray(item.tags)) {
        throw new Error(`第 ${index + 1} 条 tags 必须是数组`);
      }
    });
    return true;
  }
  const _sfc_main$7 = {
    __name: "lock-page",
    setup(__props, { expose: __expose }) {
      __expose();
      const mode = vue.ref("verify");
      const password = vue.ref("");
      const confirmPassword = vue.ref("");
      const errorMessage = vue.ref("");
      const rememberMe = vue.ref(true);
      const lockStore = useLockStore();
      let previousBodyOverflow = "";
      let previousHtmlOverflow = "";
      async function loadLockMode() {
        try {
          await initDatabase();
          const hasPassword = await hasLockPassword();
          mode.value = hasPassword ? "verify" : "set";
        } catch (error) {
          errorMessage.value = (error == null ? void 0 : error.message) || "数据库初始化失败";
        }
      }
      function clearForm() {
        password.value = "";
        confirmPassword.value = "";
      }
      function handlePasswordChange(context) {
        var _a;
        password.value = String(((_a = context == null ? void 0 : context.detail) == null ? void 0 : _a.value) ?? (context == null ? void 0 : context.value) ?? "");
      }
      function handleConfirmPasswordChange(context) {
        var _a;
        confirmPassword.value = String(((_a = context == null ? void 0 : context.detail) == null ? void 0 : _a.value) ?? (context == null ? void 0 : context.value) ?? "");
      }
      async function submitLockPassword() {
        errorMessage.value = "";
        const lockError = validateLockPassword(password.value);
        if (lockError) {
          errorMessage.value = lockError;
          return;
        }
        if (mode.value === "set") {
          if (password.value !== confirmPassword.value) {
            errorMessage.value = "两次输入的密码不一致";
            return;
          }
          await setSetting("lock_password", encodeLockPassword(password.value));
          lockStore.setUnlocked(true);
          uni.reLaunch({ url: "/pages/home-page/home-page" });
          return;
        }
        const verified = await verifyLockPassword(encodeLockPassword(password.value));
        if (!verified) {
          errorMessage.value = "密码错误，请重试";
          clearForm();
          return;
        }
        lockStore.setUnlocked(true);
        uni.reLaunch({ url: "/pages/home-page/home-page" });
      }
      loadLockMode();
      vue.onMounted(() => {
        if (typeof document !== "undefined") {
          previousBodyOverflow = document.body.style.overflow;
          previousHtmlOverflow = document.documentElement.style.overflow;
          document.body.style.overflow = "hidden";
          document.documentElement.style.overflow = "hidden";
        }
      });
      vue.onUnmounted(() => {
        if (typeof document !== "undefined") {
          document.body.style.overflow = previousBodyOverflow;
          document.documentElement.style.overflow = previousHtmlOverflow;
        }
      });
      const __returned__ = { mode, password, confirmPassword, errorMessage, rememberMe, lockStore, get previousBodyOverflow() {
        return previousBodyOverflow;
      }, set previousBodyOverflow(v) {
        previousBodyOverflow = v;
      }, get previousHtmlOverflow() {
        return previousHtmlOverflow;
      }, set previousHtmlOverflow(v) {
        previousHtmlOverflow = v;
      }, loadLockMode, clearForm, handlePasswordChange, handleConfirmPasswordChange, submitLockPassword, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted, ref: vue.ref, get initDatabase() {
        return initDatabase;
      }, get hasLockPassword() {
        return hasLockPassword;
      }, get setSetting() {
        return setSetting;
      }, get verifyLockPassword() {
        return verifyLockPassword;
      }, get useLockStore() {
        return useLockStore;
      }, get encodeLockPassword() {
        return encodeLockPassword;
      }, get validateLockPassword() {
        return validateLockPassword;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_t_input = resolveEasycom(vue.resolveDynamicComponent("t-input"), __easycom_0$1);
    const _component_t_button = resolveEasycom(vue.resolveDynamicComponent("t-button"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("text", { class: "brand-text" }, "密码管理器"),
        vue.createElementVNode("view", { class: "panel" }, [
          vue.createElementVNode("text", { class: "welcome" }, "请先设置密码！"),
          $setup.mode === "verify" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "邮箱"),
            vue.createVNode(_component_t_input, {
              class: "input input-muted",
              value: "joedoe75@gmail.com",
              disabled: ""
            })
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode(
              "text",
              { class: "label" },
              vue.toDisplayString($setup.mode === "set" ? "设置密码" : "密码"),
              1
              /* TEXT */
            ),
            vue.createVNode(_component_t_input, {
              value: $setup.password,
              class: "input",
              type: "number",
              maxlength: 6,
              clearable: "",
              placeholder: "请输入4-6位数字密码",
              onChange: $setup.handlePasswordChange
            }, null, 8, ["value"])
          ]),
          $setup.mode === "set" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "确认密码"),
            vue.createVNode(_component_t_input, {
              value: $setup.confirmPassword,
              class: "input",
              type: "number",
              maxlength: 6,
              clearable: "",
              placeholder: "请再次输入密码",
              onChange: $setup.handleConfirmPasswordChange
            }, null, 8, ["value"])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "assist-row" }, [
            vue.createElementVNode("view", {
              class: "remember",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.rememberMe = !$setup.rememberMe)
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["check-box", { checked: $setup.rememberMe }])
                },
                "v",
                2
                /* CLASS */
              ),
              vue.createElementVNode("text", { class: "assist-text" }, "记住我")
            ]),
            vue.createElementVNode("text", { class: "forgot" }, "忘记密码？")
          ]),
          $setup.errorMessage ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 2,
              class: "error"
            },
            vue.toDisplayString($setup.errorMessage),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createVNode(_component_t_button, {
            class: "login-btn",
            theme: "primary",
            block: "",
            onClick: $setup.submitLockPassword
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                vue.toDisplayString($setup.mode === "set" ? "确认" : "登录"),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })
        ])
      ])
    ]);
  }
  const PagesLockPageLockPage = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-8a784f8e"], ["__file", "D:/mine/password-manage/pages/lock-page/lock-page.vue"]]);
  const _sfc_main$6 = {
    __name: "category-tabs",
    props: {
      tabs: {
        type: Array,
        default: () => []
      },
      modelValue: {
        type: Number,
        default: 0
      }
    },
    emits: ["update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit = __emit;
      const __returned__ = { emit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("scroll-view", {
      "scroll-x": "",
      class: "tabs-scroll"
    }, [
      vue.createElementVNode("view", { class: "tabs" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($props.tabs, (tab) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: tab.id,
              class: vue.normalizeClass(["tab-item", { active: Number($props.modelValue) === Number(tab.id) }]),
              onClick: ($event) => $setup.emit("update:modelValue", Number(tab.id))
            }, vue.toDisplayString(tab.name), 11, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const CategoryTabs = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-536903b8"], ["__file", "D:/mine/password-manage/components/category-tabs.vue"]]);
  const _sfc_main$5 = {
    __name: "password-card",
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit = __emit;
      const __returned__ = { emit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "card",
      onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("click", $props.item))
    }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", { class: "left" }, [
          vue.createElementVNode(
            "text",
            { class: "icon" },
            vue.toDisplayString($props.item.icon || "🔐"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "meta" }, [
            vue.createElementVNode(
              "text",
              { class: "name" },
              vue.toDisplayString($props.item.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "account" },
              vue.toDisplayString($props.item.account),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode(
          "text",
          { class: "favorite" },
          vue.toDisplayString($props.item.is_favorite ? "★" : "☆"),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const PasswordCard = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-243b4b33"], ["__file", "D:/mine/password-manage/components/password-card.vue"]]);
  async function listCategories() {
    return selectSql("SELECT * FROM categories ORDER BY sort_order ASC, id ASC");
  }
  async function addCategory(name2) {
    var _a;
    const safeName = String(name2 || "").trim();
    if (!safeName) {
      throw new Error("分类名称不能为空");
    }
    const maxSort = await selectSql("SELECT MAX(sort_order) AS maxSort FROM categories");
    const sortOrder = Number(((_a = maxSort == null ? void 0 : maxSort[0]) == null ? void 0 : _a.maxSort) || 0) + 1;
    await executeSql("INSERT INTO categories (name, sort_order) VALUES (?, ?)", [safeName, sortOrder]);
  }
  async function deleteCategory(categoryId) {
    await executeSql("UPDATE password_items SET category_id = 0 WHERE category_id = ?", [categoryId]);
    await executeSql("DELETE FROM categories WHERE id = ?", [categoryId]);
  }
  async function updateCategorySort(categoryIds = []) {
    for (let i = 0; i < categoryIds.length; i += 1) {
      await executeSql("UPDATE categories SET sort_order = ? WHERE id = ?", [i + 1, categoryIds[i]]);
    }
  }
  function normalizeTags(tags) {
    if (Array.isArray(tags)) {
      return tags.map((item) => String(item || "").trim()).filter((item) => item.length > 0);
    }
    return [];
  }
  function now() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  async function listPasswordItems(options = {}) {
    const keyword = String(options.keyword || "").trim();
    const categoryId = Number(options.categoryId || 0);
    const sortBy = options.sortBy === "name" ? "name" : "created_at";
    const orderBy = sortBy === "name" ? "name COLLATE NOCASE ASC" : "created_at DESC";
    const whereParts = [];
    const params = [];
    if (keyword) {
      whereParts.push("(name LIKE ? OR account LIKE ?)");
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (categoryId > 0) {
      whereParts.push("category_id = ?");
      params.push(categoryId);
    }
    const whereSql = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const rows = await selectSql(
      `SELECT * FROM password_items ${whereSql} ORDER BY ${orderBy}`,
      params
    );
    return rows.map((row) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  }
  async function getPasswordItemById(id) {
    const rows = await selectSql("SELECT * FROM password_items WHERE id = ? LIMIT 1", [id]);
    if (!rows.length) {
      return null;
    }
    const row = rows[0];
    return {
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    };
  }
  async function createPasswordItem(payload) {
    const currentTime = now();
    const tags = normalizeTags(payload.tags);
    await executeSql(
      `INSERT INTO password_items 
      (name, account, password, url, note, icon, category_id, tags, is_favorite, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.name,
        payload.account,
        payload.password,
        payload.url || "",
        payload.note || "",
        payload.icon || "",
        Number(payload.categoryId || 0),
        JSON.stringify(tags),
        Number(payload.isFavorite || 0),
        currentTime,
        currentTime
      ]
    );
  }
  async function updatePasswordItem(id, payload) {
    const tags = normalizeTags(payload.tags);
    await executeSql(
      `UPDATE password_items SET
      name = ?,
      account = ?,
      password = ?,
      url = ?,
      note = ?,
      icon = ?,
      category_id = ?,
      tags = ?,
      is_favorite = ?,
      updated_at = ?
      WHERE id = ?`,
      [
        payload.name,
        payload.account,
        payload.password,
        payload.url || "",
        payload.note || "",
        payload.icon || "",
        Number(payload.categoryId || 0),
        JSON.stringify(tags),
        Number(payload.isFavorite || 0),
        now(),
        id
      ]
    );
  }
  async function deletePasswordItem(id) {
    await executeSql("DELETE FROM password_items WHERE id = ?", [id]);
  }
  async function importPasswordItems(items = []) {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const currentTime = now();
      await executeSql(
        `INSERT INTO password_items
        (name, account, password, url, note, icon, category_id, tags, is_favorite, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.name,
          item.account,
          item.password,
          item.url || "",
          item.note || "",
          item.icon || "",
          Number(item.categoryId || 0),
          JSON.stringify(normalizeTags(item.tags)),
          Number(item.isFavorite || 0),
          item.createdAt || currentTime,
          item.updatedAt || currentTime
        ]
      );
    }
  }
  async function getHomeList(filters = {}) {
    const [items, categories] = await Promise.all([listPasswordItems(filters), listCategories()]);
    const categoryMap = new Map(categories.map((item) => [item.id, item.name]));
    return items.map((item) => ({
      ...item,
      categoryName: categoryMap.get(item.category_id) || "未分类"
    }));
  }
  const _sfc_main$4 = {
    __name: "home-page",
    setup(__props, { expose: __expose }) {
      __expose();
      const keyword = vue.ref("");
      const activeCategoryId = vue.ref(0);
      const categories = vue.ref([]);
      const items = vue.ref([]);
      const lockStore = useLockStore();
      const sortOptions = [
        { label: "按创建时间", value: "created_at" },
        { label: "按名称", value: "name" }
      ];
      const sortIndex = vue.ref(0);
      const categoryTabs = vue.computed(() => [{ id: 0, name: "全部" }, ...categories.value]);
      async function loadCategories() {
        categories.value = await listCategories();
      }
      async function loadData() {
        items.value = await getHomeList({
          keyword: keyword.value,
          categoryId: activeCategoryId.value,
          sortBy: sortOptions[sortIndex.value].value
        });
      }
      function handleSortChange(event) {
        sortIndex.value = Number(event.detail.value || 0);
        loadData();
      }
      function goAddPage() {
        uni.navigateTo({ url: "/pages/edit-page/edit-page" });
      }
      function goDetail(id) {
        uni.navigateTo({ url: `/pages/detail-page/detail-page?id=${id}` });
      }
      function goSettings() {
        uni.navigateTo({ url: "/pages/settings-page/settings-page" });
      }
      vue.watch([activeCategoryId, keyword], () => {
        loadData();
      });
      onShow(async () => {
        if (!lockStore.state.unlocked) {
          uni.reLaunch({ url: "/pages/lock-page/lock-page" });
          return;
        }
        await loadCategories();
        await loadData();
      });
      const __returned__ = { keyword, activeCategoryId, categories, items, lockStore, sortOptions, sortIndex, categoryTabs, loadCategories, loadData, handleSortChange, goAddPage, goDetail, goSettings, computed: vue.computed, ref: vue.ref, watch: vue.watch, get onShow() {
        return onShow;
      }, CategoryTabs, PasswordCard, get listCategories() {
        return listCategories;
      }, get getHomeList() {
        return getHomeList;
      }, get useLockStore() {
        return useLockStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_t_icon = resolveEasycom(vue.resolveDynamicComponent("t-icon"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { class: "fab-actions" }, [
        vue.createElementVNode("view", {
          class: "fab-item",
          onClick: $setup.goAddPage
        }, [
          vue.createVNode(_component_t_icon, {
            name: "add-circle",
            size: "64rpx"
          })
        ]),
        vue.createElementVNode("view", {
          class: "fab-item",
          onClick: $setup.goSettings
        }, [
          vue.createVNode(_component_t_icon, {
            name: "setting",
            size: "55rpx"
          })
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "list-area"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.items, (item) => {
            return vue.openBlock(), vue.createBlock($setup["PasswordCard"], {
              key: item.id,
              item,
              onClick: ($event) => $setup.goDetail(item.id)
            }, null, 8, ["item", "onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        !$setup.items.length ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty"
        }, "暂无数据，点击右上角新增")) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesHomePageHomePage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-456c689e"], ["__file", "D:/mine/password-manage/pages/home-page/home-page.vue"]]);
  const _sfc_main$3 = {
    __name: "edit-page",
    setup(__props, { expose: __expose }) {
      __expose();
      const itemId = vue.ref(0);
      const categoryOptions = vue.ref([{ id: 0, name: "未分类" }]);
      const categoryIndex = vue.ref(0);
      const showPassword = vue.ref(false);
      const errors = vue.ref({});
      const form = vue.ref({
        name: "",
        account: "",
        password: "",
        url: "",
        note: "",
        icon: "🔐",
        categoryId: 0,
        tags: []
      });
      const isEdit = vue.computed(() => itemId.value > 0);
      async function loadCategories() {
        const categories = await listCategories();
        categoryOptions.value = [{ id: 0, name: "未分类" }, ...categories];
      }
      function syncCategoryIndex() {
        const index = categoryOptions.value.findIndex((item) => Number(item.id) === Number(form.value.categoryId));
        categoryIndex.value = index < 0 ? 0 : index;
      }
      function handleCategoryChange(event) {
        categoryIndex.value = Number(event.detail.value || 0);
        form.value.categoryId = categoryOptions.value[categoryIndex.value].id;
      }
      function copyText(content) {
        uni.setClipboardData({ data: String(content || "") });
      }
      async function loadDetail(id) {
        const detail = await getPasswordItemById(id);
        if (!detail) {
          uni.showToast({ title: "数据不存在", icon: "none" });
          uni.navigateBack();
          return;
        }
        form.value = {
          name: detail.name || "",
          account: detail.account || "",
          password: detail.password || "",
          url: detail.url || "",
          note: detail.note || "",
          icon: detail.icon || "🔐",
          categoryId: Number(detail.category_id || 0),
          tags: Array.isArray(detail.tags) ? detail.tags : []
        };
        syncCategoryIndex();
      }
      async function submitForm() {
        form.value.tags = [];
        const newErrors = validatePasswordItemForm(form.value);
        errors.value = newErrors;
        if (Object.keys(newErrors).length) {
          return;
        }
        if (isEdit.value) {
          await updatePasswordItem(itemId.value, form.value);
        } else {
          await createPasswordItem(form.value);
        }
        uni.showToast({ title: "保存成功", icon: "success" });
        setTimeout(() => {
          uni.navigateBack();
        }, 300);
      }
      onLoad(async (query) => {
        await loadCategories();
        if (query == null ? void 0 : query.id) {
          itemId.value = Number(query.id);
          await loadDetail(itemId.value);
        } else {
          syncCategoryIndex();
        }
      });
      const __returned__ = { itemId, categoryOptions, categoryIndex, showPassword, errors, form, isEdit, loadCategories, syncCategoryIndex, handleCategoryChange, copyText, loadDetail, submitForm, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get createPasswordItem() {
        return createPasswordItem;
      }, get getPasswordItemById() {
        return getPasswordItemById;
      }, get updatePasswordItem() {
        return updatePasswordItem;
      }, get listCategories() {
        return listCategories;
      }, get validatePasswordItemForm() {
        return validatePasswordItemForm;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_t_button = resolveEasycom(vue.resolveDynamicComponent("t-button"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("scroll-view", {
      "scroll-y": "",
      class: "page"
    }, [
      vue.createElementVNode("view", { class: "card" }, [
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "名称 *"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.name = $event),
              class: "input",
              placeholder: "如：GitHub"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.form.name]
          ]),
          $setup.errors.name ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "error"
            },
            vue.toDisplayString($setup.errors.name),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "账号 *"),
          vue.createElementVNode("view", { class: "row" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.account = $event),
                class: "input flex",
                placeholder: "账号"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.form.account]
            ]),
            vue.createVNode(_component_t_button, {
              size: "extra-small",
              class: "text-action-btn",
              variant: "text",
              theme: "primary",
              onClick: _cache[2] || (_cache[2] = ($event) => $setup.copyText($setup.form.account))
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("复制")
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          $setup.errors.account ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "error"
            },
            vue.toDisplayString($setup.errors.account),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "密码 *"),
          vue.createElementVNode("view", { class: "row" }, [
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.form.password = $event),
              class: "input flex",
              password: !$setup.showPassword,
              placeholder: "密码"
            }, null, 8, ["password"]), [
              [vue.vModelText, $setup.form.password]
            ]),
            vue.createVNode(_component_t_button, {
              size: "extra-small",
              class: "text-action-btn",
              variant: "text",
              theme: "primary",
              onClick: _cache[4] || (_cache[4] = ($event) => $setup.showPassword = !$setup.showPassword)
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(
                  vue.toDisplayString($setup.showPassword ? "隐藏" : "显示"),
                  1
                  /* TEXT */
                )
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createVNode(_component_t_button, {
              size: "extra-small",
              class: "text-action-btn",
              variant: "text",
              theme: "primary",
              onClick: _cache[5] || (_cache[5] = ($event) => $setup.copyText($setup.form.password))
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("复制")
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          $setup.errors.password ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "error"
            },
            vue.toDisplayString($setup.errors.password),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "网站地址"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.form.url = $event),
              class: "input",
              placeholder: "https://example.com"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.form.url]
          ])
        ]),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "图标"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.form.icon = $event),
              class: "input",
              placeholder: "例如：🔒"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.form.icon]
          ])
        ]),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "分类"),
          vue.createElementVNode("picker", {
            range: $setup.categoryOptions,
            "range-key": "name",
            value: $setup.categoryIndex,
            onChange: $setup.handleCategoryChange
          }, [
            vue.createElementVNode(
              "view",
              { class: "picker" },
              vue.toDisplayString(((_a = $setup.categoryOptions[$setup.categoryIndex]) == null ? void 0 : _a.name) || "请选择分类"),
              1
              /* TEXT */
            )
          ], 40, ["range", "value"])
        ]),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "备注"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.form.note = $event),
              class: "textarea",
              placeholder: "补充信息"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.form.note]
          ])
        ]),
        vue.createVNode(_component_t_button, {
          theme: "primary",
          block: "",
          onClick: $setup.submitForm
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode(
              vue.toDisplayString($setup.isEdit ? "保存修改" : "创建记录"),
              1
              /* TEXT */
            )
          ]),
          _: 1
          /* STABLE */
        })
      ])
    ]);
  }
  const PagesEditPageEditPage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-4f3a42d7"], ["__file", "D:/mine/password-manage/pages/edit-page/edit-page.vue"]]);
  function formatDateTime(isoText) {
    if (!isoText) {
      return "";
    }
    const date = new Date(isoText);
    if (Number.isNaN(date.getTime())) {
      return String(isoText);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  const _sfc_main$2 = {
    __name: "detail-page",
    setup(__props, { expose: __expose }) {
      __expose();
      const itemId = vue.ref(0);
      const detail = vue.ref(null);
      const showPassword = vue.ref(false);
      async function loadDetail() {
        detail.value = await getPasswordItemById(itemId.value);
      }
      function copyText(text) {
        uni.setClipboardData({ data: String(text || "") });
      }
      function goEdit() {
        uni.navigateTo({ url: `/pages/edit-page/edit-page?id=${itemId.value}` });
      }
      function openUrl(url) {
        if (!url) {
          return;
        }
        if (typeof plus !== "undefined" && plus.runtime) {
          plus.runtime.openURL(url);
          return;
        }
        uni.setClipboardData({ data: url });
        uni.showToast({ title: "已复制URL", icon: "none" });
      }
      function confirmDelete() {
        uni.showModal({
          title: "删除确认",
          content: "删除后不可恢复，确认删除吗？",
          success: async (result) => {
            if (!result.confirm) {
              return;
            }
            await deletePasswordItem(itemId.value);
            uni.showToast({ title: "删除成功", icon: "success" });
            setTimeout(() => {
              uni.navigateBack();
            }, 300);
          }
        });
      }
      onLoad((query) => {
        itemId.value = Number((query == null ? void 0 : query.id) || 0);
      });
      onShow(() => {
        if (!itemId.value) {
          return;
        }
        loadDetail();
      });
      const __returned__ = { itemId, detail, showPassword, loadDetail, copyText, goEdit, openUrl, confirmDelete, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, get deletePasswordItem() {
        return deletePasswordItem;
      }, get getPasswordItemById() {
        return getPasswordItemById;
      }, get formatDateTime() {
        return formatDateTime;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_t_button = resolveEasycom(vue.resolveDynamicComponent("t-button"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("scroll-view", {
      "scroll-y": "",
      class: "page"
    }, [
      $setup.detail ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "card"
      }, [
        vue.createElementVNode("view", { class: "header" }, [
          vue.createElementVNode(
            "text",
            { class: "icon" },
            vue.toDisplayString($setup.detail.icon || "🔐"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "title-group" }, [
            vue.createElementVNode(
              "text",
              { class: "name" },
              vue.toDisplayString($setup.detail.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "account" },
              vue.toDisplayString($setup.detail.account),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "line" }, [
          vue.createElementVNode("text", { class: "key" }, "账号"),
          vue.createElementVNode("view", { class: "value-row" }, [
            vue.createElementVNode(
              "text",
              { class: "value" },
              vue.toDisplayString($setup.detail.account),
              1
              /* TEXT */
            ),
            vue.createVNode(_component_t_button, {
              size: "extra-small",
              class: "text-action-btn",
              variant: "text",
              theme: "primary",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.copyText($setup.detail.account))
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("复制")
              ]),
              _: 1
              /* STABLE */
            })
          ])
        ]),
        vue.createElementVNode("view", { class: "line" }, [
          vue.createElementVNode("text", { class: "key" }, "密码"),
          vue.createElementVNode("view", { class: "value-row" }, [
            vue.createElementVNode(
              "text",
              { class: "value" },
              vue.toDisplayString($setup.showPassword ? $setup.detail.password : "••••••••"),
              1
              /* TEXT */
            ),
            vue.createVNode(_component_t_button, {
              size: "extra-small",
              class: "text-action-btn",
              variant: "text",
              theme: "primary",
              onClick: _cache[1] || (_cache[1] = ($event) => $setup.showPassword = !$setup.showPassword)
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(
                  vue.toDisplayString($setup.showPassword ? "隐藏" : "显示"),
                  1
                  /* TEXT */
                )
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createVNode(_component_t_button, {
              size: "extra-small",
              class: "text-action-btn",
              variant: "text",
              theme: "primary",
              onClick: _cache[2] || (_cache[2] = ($event) => $setup.copyText($setup.detail.password))
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("复制")
              ]),
              _: 1
              /* STABLE */
            })
          ])
        ]),
        vue.createElementVNode("view", { class: "line" }, [
          vue.createElementVNode("text", { class: "key" }, "URL"),
          vue.createElementVNode(
            "text",
            {
              class: "link",
              onClick: _cache[3] || (_cache[3] = ($event) => $setup.openUrl($setup.detail.url))
            },
            vue.toDisplayString($setup.detail.url || "-"),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "line" }, [
          vue.createElementVNode("text", { class: "key" }, "标签"),
          vue.createElementVNode("view", { class: "tag-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.detail.tags, (tag) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: tag,
                    class: "tag"
                  },
                  vue.toDisplayString(tag),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            !$setup.detail.tags.length ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "value"
            }, "-")) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createElementVNode("view", { class: "line" }, [
          vue.createElementVNode("text", { class: "key" }, "备注"),
          vue.createElementVNode(
            "text",
            { class: "value note" },
            vue.toDisplayString($setup.detail.note || "-"),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "line" }, [
          vue.createElementVNode("text", { class: "key" }, "创建时间"),
          vue.createElementVNode(
            "text",
            { class: "value" },
            vue.toDisplayString($setup.formatDateTime($setup.detail.created_at)),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "line" }, [
          vue.createElementVNode("text", { class: "key" }, "更新时间"),
          vue.createElementVNode(
            "text",
            { class: "value" },
            vue.toDisplayString($setup.formatDateTime($setup.detail.updated_at)),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "footer" }, [
          vue.createVNode(_component_t_button, {
            theme: "primary",
            onClick: $setup.goEdit
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("编辑")
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_t_button, {
            theme: "danger",
            variant: "outline",
            onClick: $setup.confirmDelete
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("删除")
            ]),
            _: 1
            /* STABLE */
          })
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesDetailPageDetailPage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-589977cd"], ["__file", "D:/mine/password-manage/pages/detail-page/detail-page.vue"]]);
  const _sfc_main$1 = {
    __name: "settings-page",
    setup(__props, { expose: __expose }) {
      __expose();
      const passwordForm = vue.ref({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      const categories = vue.ref([]);
      const newCategoryName = vue.ref("");
      const importText = vue.ref("");
      async function loadCategories() {
        categories.value = await listCategories();
      }
      function resetPasswordForm() {
        passwordForm.value = {
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        };
      }
      async function changeLockPassword() {
        const oldValid = validateLockPassword(passwordForm.value.oldPassword);
        if (oldValid) {
          uni.showToast({ title: oldValid, icon: "none" });
          return;
        }
        const newValid = validateLockPassword(passwordForm.value.newPassword);
        if (newValid) {
          uni.showToast({ title: newValid, icon: "none" });
          return;
        }
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
          uni.showToast({ title: "两次新密码不一致", icon: "none" });
          return;
        }
        const verified = await verifyLockPassword(encodeLockPassword(passwordForm.value.oldPassword));
        if (!verified) {
          uni.showToast({ title: "当前密码错误", icon: "none" });
          return;
        }
        await setSetting("lock_password", encodeLockPassword(passwordForm.value.newPassword));
        resetPasswordForm();
        uni.showToast({ title: "修改成功", icon: "success" });
      }
      async function createCategory() {
        if (!newCategoryName.value.trim()) {
          uni.showToast({ title: "请输入分类名称", icon: "none" });
          return;
        }
        await addCategory(newCategoryName.value);
        newCategoryName.value = "";
        await loadCategories();
      }
      async function removeCategory(id) {
        await deleteCategory(id);
        await loadCategories();
      }
      async function saveCategorySort() {
        await updateCategorySort(categories.value.map((item) => item.id));
      }
      async function moveUp(index) {
        if (index <= 0) {
          return;
        }
        const list = [...categories.value];
        const temp = list[index];
        list[index] = list[index - 1];
        list[index - 1] = temp;
        categories.value = list;
        await saveCategorySort();
      }
      async function moveDown(index) {
        if (index >= categories.value.length - 1) {
          return;
        }
        const list = [...categories.value];
        const temp = list[index];
        list[index] = list[index + 1];
        list[index + 1] = temp;
        categories.value = list;
        await saveCategorySort();
      }
      async function importJsonData() {
        if (!importText.value.trim()) {
          uni.showToast({ title: "请先粘贴JSON数据", icon: "none" });
          return;
        }
        try {
          const parsed = JSON.parse(importText.value);
          validateImportJson(parsed);
          await importPasswordItems(parsed);
          importText.value = "";
          uni.showToast({ title: "导入成功", icon: "success" });
        } catch (error) {
          uni.showToast({ title: (error == null ? void 0 : error.message) || "导入失败", icon: "none" });
        }
      }
      onShow(() => {
        loadCategories();
      });
      const __returned__ = { passwordForm, categories, newCategoryName, importText, loadCategories, resetPasswordForm, changeLockPassword, createCategory, removeCategory, saveCategorySort, moveUp, moveDown, importJsonData, ref: vue.ref, get onShow() {
        return onShow;
      }, get addCategory() {
        return addCategory;
      }, get deleteCategory() {
        return deleteCategory;
      }, get listCategories() {
        return listCategories;
      }, get updateCategorySort() {
        return updateCategorySort;
      }, get importPasswordItems() {
        return importPasswordItems;
      }, get setSetting() {
        return setSetting;
      }, get verifyLockPassword() {
        return verifyLockPassword;
      }, get encodeLockPassword() {
        return encodeLockPassword;
      }, get validateImportJson() {
        return validateImportJson;
      }, get validateLockPassword() {
        return validateLockPassword;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_t_button = resolveEasycom(vue.resolveDynamicComponent("t-button"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("scroll-view", {
      "scroll-y": "",
      class: "page"
    }, [
      vue.createElementVNode("view", { class: "card" }, [
        vue.createElementVNode("text", { class: "section-title" }, "修改启动密码"),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "当前密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.passwordForm.oldPassword = $event),
              class: "input",
              type: "number",
              password: "",
              maxlength: "6"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.passwordForm.oldPassword]
          ])
        ]),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "新密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.passwordForm.newPassword = $event),
              class: "input",
              type: "number",
              password: "",
              maxlength: "6"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.passwordForm.newPassword]
          ])
        ]),
        vue.createElementVNode("view", { class: "field" }, [
          vue.createElementVNode("text", { class: "label" }, "确认新密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.passwordForm.confirmPassword = $event),
              class: "input",
              type: "number",
              password: "",
              maxlength: "6"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.passwordForm.confirmPassword]
          ])
        ]),
        vue.createVNode(_component_t_button, {
          theme: "primary",
          block: "",
          onClick: $setup.changeLockPassword
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("更新启动密码")
          ]),
          _: 1
          /* STABLE */
        })
      ]),
      vue.createElementVNode("view", { class: "card" }, [
        vue.createElementVNode("text", { class: "section-title" }, "分类管理"),
        vue.createElementVNode("view", { class: "row" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.newCategoryName = $event),
              class: "input flex",
              placeholder: "输入新分类名称"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.newCategoryName]
          ]),
          vue.createVNode(_component_t_button, {
            size: "small",
            theme: "primary",
            onClick: $setup.createCategory
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("新增")
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.categories, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "category-row"
            }, [
              vue.createElementVNode(
                "text",
                { class: "category-name" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "row" }, [
                vue.createVNode(_component_t_button, {
                  size: "small",
                  variant: "outline",
                  onClick: ($event) => $setup.moveUp(index)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("上移")
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"]),
                vue.createVNode(_component_t_button, {
                  size: "small",
                  variant: "outline",
                  onClick: ($event) => $setup.moveDown(index)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("下移")
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"]),
                vue.createVNode(_component_t_button, {
                  size: "small",
                  theme: "danger",
                  variant: "outline",
                  onClick: ($event) => $setup.removeCategory(item.id)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("删除")
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"])
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "card" }, [
        vue.createElementVNode("text", { class: "section-title" }, "数据导入（JSON数组）"),
        vue.withDirectives(vue.createElementVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.importText = $event),
            class: "textarea",
            placeholder: '示例：[{"name":"GitHub","account":"a@b.com","password":"123456","tags":["工作"]}]'
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.importText]
        ]),
        vue.createVNode(_component_t_button, {
          theme: "primary",
          block: "",
          onClick: $setup.importJsonData
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("导入数据")
          ]),
          _: 1
          /* STABLE */
        })
      ])
    ]);
  }
  const PagesSettingsPageSettingsPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-57911d4c"], ["__file", "D:/mine/password-manage/pages/settings-page/settings-page.vue"]]);
  __definePage("pages/lock-page/lock-page", PagesLockPageLockPage);
  __definePage("pages/home-page/home-page", PagesHomePageHomePage);
  __definePage("pages/edit-page/edit-page", PagesEditPageEditPage);
  __definePage("pages/detail-page/detail-page", PagesDetailPageDetailPage);
  __definePage("pages/settings-page/settings-page", PagesSettingsPageSettingsPage);
  const _sfc_main = {
    onLaunch() {
    },
    onShow() {
    },
    onHide() {
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/mine/password-manage/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
