        B({
          code: XqA.ExportResultCode.FAILED,
          error: Q instanceof Error ? Q : Error("Unknown export error"),
        }));
    }
  }
  hrTimeToISOString(A) {
    let [B, Q] = A;
    return new Date(B * 1000 + Q / 1e6).toISOString();
  }
  async transformLogsToEvents(A) {
    let B = await Bp(),
      { env: Q, process: I, core: G } = Wp2(B);
    return {
      events: A.map((Y) => {
        let J = Y.attributes || {},
          W = {
            event_name: J.event_name || Y.body || "unknown",
            client_timestamp: this.hrTimeToISOString(Y.hrTime),
            session_id: G.session_id,
            model: G.model,
            user_type: G.user_type,
            is_interactive: G.is_interactive,
            client_type: G.client_type,
            env: Q,
          };
        if (G.betas) W.betas = G.betas;
        if (G.entrypoint) W.entrypoint = G.entrypoint;
        if (G.agent_sdk_version) W.agent_sdk_version = G.agent_sdk_version;
        if (I) W.process = I;
        let F = {},
          C = new Set(["event_name", "model", "session_id"]);
        for (let [V, K] of Object.entries(J))
          if (!C.has(V) && K !== void 0) F[V] = K;
        if (G.swe_bench_run_id && !F.swe_bench_run_id)
          F.swe_bench_run_id = G.swe_bench_run_id;
        if (G.swe_bench_instance_id && !F.swe_bench_instance_id)
          F.swe_bench_instance_id = G.swe_bench_instance_id;
        if (G.swe_bench_task_id && !F.swe_bench_task_id)
          F.swe_bench_task_id = G.swe_bench_task_id;
        if (Object.keys(F).length > 0)
          W.additional_metadata = JSON.stringify(F);
        return { event_type: "ClaudeCodeInternalEvent", event_data: W };
      }),
    };
  }
  async shutdown() {
    ((this.isShutdown = !0), await this.forceFlush());
  }
  async forceFlush() {
    await Promise.all(this.pendingExports);
  }
}
var XqA;
var co2 = T(() => {
  _I();
  C0();
  c1();
  yH();
  F2();
  VR();
  R$A();
  XqA = IA(M6(), 1);
});
import { randomUUID as $2I } from "crypto";
function lo2() {
  if (NV()) return !1;
  if (!V0(void 0)) return !1;
  return xC("tengu_log_1p_events");
}
function lB0(A, B = {}) {
  if (!lo2()) return;
  if (!pB0) return;
  let Q = { event_name: A, event_id: $2I(), session_id: L0() },
    I = Id();
  if (I) Q.user_id = I;
  for (let [G, Z] of Object.entries(B)) if (Z !== void 0) Q[G] = Z;
  pB0.emit({ body: A, attributes: Q });
}
function io2() {
  if (!lo2()) return;
  let B = T2A("tengu_1p_event_batch_config", {}),
    Q =
      B.scheduledDelayMillis ||
      parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || q2I.toString()),
    I = B.maxExportBatchSize || N2I,
    G = EB(),
    Z = {
      [jQ1.ATTR_SERVICE_NAME]: "claude-code",
      [jQ1.ATTR_SERVICE_VERSION]: {
        ISSUES_EXPLAINER:
          "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://docs.claude.com/s/claude-code",
        VERSION: "2.0.42",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      }.VERSION,
    };
  if (G === "wsl") {
    let X = Ji();
    if (X) Z["wsl.version"] = X;
  }
  let Y = po2.resourceFromAttributes(Z),
    J = new cB0();
  ((WqA = new PQ1.LoggerProvider({
    resource: Y,
    processors: [
      new PQ1.BatchLogRecordProcessor(J, {
        scheduledDelayMillis: Q,
        maxExportBatchSize: I,
      }),
    ],
  })),
    (pB0 = WqA.getLogger(
      "com.anthropic.claude_code.events",
      {
        ISSUES_EXPLAINER:
          "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://docs.claude.com/s/claude-code",
        VERSION: "2.0.42",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      }.VERSION,
    )),
    nY(async () => {
      await WqA?.shutdown();
    }),
    process.on("beforeExit", async () => {
      await WqA?.forceFlush();
    }),
    process.on("exit", () => {
      WqA?.forceFlush();
    }));
}
var PQ1,
  po2,
  jQ1,
  pB0 = null,
  WqA = null,
  q2I = 20000,
  N2I = 200;
var iB0 = T(() => {
  i0();
  kB();
  vB();
  f4();
  J7A();
  co2();
  E5();
  BU();
  ((PQ1 = IA(lo1(), 1)), (po2 = IA(eIA(), 1)), (jQ1 = IA(Wo(), 1)));
});
function so2() {
  if (nB0 !== void 0) return nB0;
  try {
    return L1().cachedStatsigGates[no2] ?? !1;
  } catch {
    return !1;
  }
}
function ro2() {
  if (aB0 !== void 0) return aB0;
  try {
    return L1().cachedStatsigGates[ao2] ?? !1;
  } catch {
    return !1;
  }
}
async function oo2() {
  ((nB0 = await _F(no2)), (aB0 = await _F(ao2)));
}
function GA(A, B) {
  if ((go2(A, B), so2())) y10(A, B);
  if (ro2()) dB0(A, B);
  lB0(A, B);
}
async function BD(A, B) {
  let Q = [uB0(A, B)];
  if (so2()) Q.push(y10(A, B));
  if (ro2()) Q.push(dB0(A, B));
  (lB0(A, B), await Promise.all(Q));
}
var no2 = "tengu_log_segment_events",
  ao2 = "tengu_log_datadog_events",
  nB0 = void 0,
  aB0 = void 0;
var H0 = T(() => {
  f4();
  k10();
  do2();
  kB();
  iB0();
});
import nZ from "node:path";
import to2 from "node:os";
import sB0 from "node:process";
function oB0(A, { suffix: B = "nodejs" } = {}) {
  if (typeof A !== "string")
    throw TypeError(`Expected a string, got ${typeof A}`);
  if (B) A += `-${B}`;
  if (sB0.platform === "darwin") return L2I(A);
  if (sB0.platform === "win32") return M2I(A);
  return O2I(A);
}
var Fp,
  rB0,
  g7A,
  L2I = (A) => {
    let B = nZ.join(Fp, "Library");
    return {
      data: nZ.join(B, "Application Support", A),
      config: nZ.join(B, "Preferences", A),
      cache: nZ.join(B, "Caches", A),
      log: nZ.join(B, "Logs", A),
      temp: nZ.join(rB0, A),
    };
  },
  M2I = (A) => {
    let B = g7A.APPDATA || nZ.join(Fp, "AppData", "Roaming"),
      Q = g7A.LOCALAPPDATA || nZ.join(Fp, "AppData", "Local");
    return {
      data: nZ.join(Q, A, "Data"),
      config: nZ.join(B, A, "Config"),
      cache: nZ.join(Q, A, "Cache"),
      log: nZ.join(Q, A, "Log"),
      temp: nZ.join(rB0, A),
    };
  },
  O2I = (A) => {
    let B = nZ.basename(Fp);
    return {
      data: nZ.join(g7A.XDG_DATA_HOME || nZ.join(Fp, ".local", "share"), A),
      config: nZ.join(g7A.XDG_CONFIG_HOME || nZ.join(Fp, ".config"), A),
      cache: nZ.join(g7A.XDG_CACHE_HOME || nZ.join(Fp, ".cache"), A),
      log: nZ.join(g7A.XDG_STATE_HOME || nZ.join(Fp, ".local", "state"), A),
      temp: nZ.join(rB0, B, A),
    };
  };
var eo2 = T(() => {
  ((Fp = to2.homedir()), (rB0 = to2.tmpdir()), ({ env: g7A } = sB0));
});
var Gt2 = z((oHG, It2) => {
  It2.exports = Bt2;
  function Bt2(A, B, Q) {
    if (A instanceof RegExp) A = At2(A, Q);
    if (B instanceof RegExp) B = At2(B, Q);
    var I = Qt2(A, B, Q);
    return (
      I && {
        start: I[0],
        end: I[1],
        pre: Q.slice(0, I[0]),
        body: Q.slice(I[0] + A.length, I[1]),
        post: Q.slice(I[1] + B.length),
      }
    );
  }
  function At2(A, B) {
    var Q = B.match(A);
    return Q ? Q[0] : null;
  }
  Bt2.range = Qt2;
  function Qt2(A, B, Q) {
    var I,
      G,
      Z,
      Y,
      J,
      X = Q.indexOf(A),
      W = Q.indexOf(B, X + 1),
      F = X;
    if (X >= 0 && W > 0) {
      if (A === B) return [X, W];
      ((I = []), (Z = Q.length));
      while (F >= 0 && !J) {
        if (F == X) (I.push(F), (X = Q.indexOf(A, F + 1)));
        else if (I.length == 1) J = [I.pop(), W];
        else {
          if (((G = I.pop()), G < Z)) ((Z = G), (Y = W));
          W = Q.indexOf(B, F + 1);
        }
        F = X < W && X >= 0 ? X : W;
      }
      if (I.length) J = [Z, Y];
    }
    return J;
  }
});
var Vt2 = z((tHG, Ct2) => {
  var Zt2 = Gt2();
  Ct2.exports = P2I;
  var Yt2 = "\x00SLASH" + Math.random() + "\x00",
    Jt2 = "\x00OPEN" + Math.random() + "\x00",
    eB0 = "\x00CLOSE" + Math.random() + "\x00",
    Xt2 = "\x00COMMA" + Math.random() + "\x00",
    Wt2 = "\x00PERIOD" + Math.random() + "\x00";
  function tB0(A) {
    return parseInt(A, 10) == A ? parseInt(A, 10) : A.charCodeAt(0);
  }
  function R2I(A) {
    return A.split("\\\\")
      .join(Yt2)
      .split("\\{")
      .join(Jt2)
      .split("\\}")
      .join(eB0)
      .split("\\,")
      .join(Xt2)
      .split("\\.")
      .join(Wt2);
  }
  function T2I(A) {
    return A.split(Yt2)
      .join("\\")
      .split(Jt2)
      .join("{")
      .split(eB0)
      .join("}")
      .split(Xt2)
      .join(",")
      .split(Wt2)
      .join(".");
  }
  function Ft2(A) {
    if (!A) return [""];
    var B = [],
      Q = Zt2("{", "}", A);
    if (!Q) return A.split(",");
    var { pre: I, body: G, post: Z } = Q,
      Y = I.split(",");
    Y[Y.length - 1] += "{" + G + "}";
    var J = Ft2(Z);
    if (Z.length) ((Y[Y.length - 1] += J.shift()), Y.push.apply(Y, J));
    return (B.push.apply(B, Y), B);
  }
  function P2I(A) {
    if (!A) return [];
    if (A.substr(0, 2) === "{}") A = "\\{\\}" + A.substr(2);
    return FqA(R2I(A), !0).map(T2I);
  }
  function j2I(A) {
    return "{" + A + "}";
  }
  function S2I(A) {
    return /^-?0\d/.test(A);
  }
  function y2I(A, B) {
    return A <= B;
  }
  function k2I(A, B) {
    return A >= B;
  }
  function FqA(A, B) {
    var Q = [],
      I = Zt2("{", "}", A);
    if (!I) return [A];
    var G = I.pre,
      Z = I.post.length ? FqA(I.post, !1) : [""];
    if (/\$$/.test(I.pre))
      for (var Y = 0; Y < Z.length; Y++) {
        var J = G + "{" + I.body + "}" + Z[Y];
        Q.push(J);
      }
    else {
      var X = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(I.body),
        W = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(I.body),
        F = X || W,
        C = I.body.indexOf(",") >= 0;
      if (!F && !C) {
        if (I.post.match(/,.*\}/))
          return ((A = I.pre + "{" + I.body + eB0 + I.post), FqA(A));
        return [A];
      }
      var V;
      if (F) V = I.body.split(/\.\./);
      else if (((V = Ft2(I.body)), V.length === 1)) {
        if (((V = FqA(V[0], !1).map(j2I)), V.length === 1))
          return Z.map(function (n) {
            return I.pre + V[0] + n;
          });
      }
      var K;
      if (F) {
        var D = tB0(V[0]),
          E = tB0(V[1]),
          H = Math.max(V[0].length, V[1].length),
          w = V.length == 3 ? Math.abs(tB0(V[2])) : 1,
          L = y2I,
          N = E < D;
        if (N) ((w *= -1), (L = k2I));
        var $ = V.some(S2I);
        K = [];
        for (var O = D; L(O, E); O += w) {
          var P;
          if (W) {
            if (((P = String.fromCharCode(O)), P === "\\")) P = "";
          } else if (((P = String(O)), $)) {
            var k = H - P.length;
            if (k > 0) {
              var b = Array(k + 1).join("0");
              if (O < 0) P = "-" + b + P.slice(1);
              else P = b + P;
            }
          }
          K.push(P);
        }
      } else {
        K = [];
        for (var x = 0; x < V.length; x++) K.push.apply(K, FqA(V[x], !1));
      }
      for (var x = 0; x < K.length; x++)
        for (var Y = 0; Y < Z.length; Y++) {
          var J = G + K[x] + Z[Y];
          if (!B || F || J) Q.push(J);
        }
    }
    return Q;
  }
});
var CqA = (A) => {
  if (typeof A !== "string") throw TypeError("invalid pattern");
  if (A.length > 65536) throw TypeError("pattern is too long");
};
var _2I,
  VqA = (A) => A.replace(/[[\]\\-]/g, "\\$&"),
  x2I = (A) => A.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
  Kt2 = (A) => A.join(""),
  Dt2 = (A, B) => {
    let Q = B;
    if (A.charAt(Q) !== "[") throw Error("not in a brace expression");
    let I = [],
      G = [],
      Z = Q + 1,
      Y = !1,
      J = !1,
      X = !1,
      W = !1,
      F = Q,
      C = "";
    A: while (Z < A.length) {
      let E = A.charAt(Z);
      if ((E === "!" || E === "^") && Z === Q + 1) {
        ((W = !0), Z++);
        continue;
      }
      if (E === "]" && Y && !X) {
        F = Z + 1;
        break;
      }
      if (((Y = !0), E === "\\")) {
        if (!X) {
          ((X = !0), Z++);
          continue;
        }
      }
      if (E === "[" && !X) {
        for (let [H, [w, L, N]] of Object.entries(_2I))
          if (A.startsWith(H, Z)) {
            if (C) return ["$.", !1, A.length - Q, !0];
            if (((Z += H.length), N)) G.push(w);
            else I.push(w);
            J = J || L;
            continue A;
          }
      }
      if (((X = !1), C)) {
        if (E > C) I.push(VqA(C) + "-" + VqA(E));
        else if (E === C) I.push(VqA(E));
        ((C = ""), Z++);
        continue;
      }
      if (A.startsWith("-]", Z + 1)) {
        (I.push(VqA(E + "-")), (Z += 2));
        continue;
      }
      if (A.startsWith("-", Z + 1)) {
        ((C = E), (Z += 2));
        continue;
      }
      (I.push(VqA(E)), Z++);
    }
    if (F < Z) return ["", !1, 0, !1];
    if (!I.length && !G.length) return ["$.", !1, A.length - Q, !0];
    if (G.length === 0 && I.length === 1 && /^\\?.$/.test(I[0]) && !W) {
      let E = I[0].length === 2 ? I[0].slice(-1) : I[0];
      return [x2I(E), !1, F - Q, !1];
    }
    let V = "[" + (W ? "^" : "") + Kt2(I) + "]",
      K = "[" + (W ? "" : "^") + Kt2(G) + "]";
    return [
      I.length && G.length ? "(" + V + "|" + K + ")" : I.length ? V : K,
      J,
      F - Q,
      !0,
    ];
  };
var Et2 = T(() => {
  _2I = {
    "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", !0],
    "[:alpha:]": ["\\p{L}\\p{Nl}", !0],
    "[:ascii:]": ["\\x00-\\x7f", !1],
    "[:blank:]": ["\\p{Zs}\\t", !0],
    "[:cntrl:]": ["\\p{Cc}", !0],
    "[:digit:]": ["\\p{Nd}", !0],
    "[:graph:]": ["\\p{Z}\\p{C}", !0, !0],
    "[:lower:]": ["\\p{Ll}", !0],
    "[:print:]": ["\\p{C}", !0],
    "[:punct:]": ["\\p{P}", !0],
    "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", !0],
    "[:upper:]": ["\\p{Lu}", !0],
    "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", !0],
    "[:xdigit:]": ["A-Fa-f0-9", !1],
  };
});
var fR = (A, { windowsPathsNoEscape: B = !1 } = {}) => {
  return B
    ? A.replace(/\[([^\/\\])\]/g, "$1")
    : A.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(
        /\\([^\/])/g,
        "$1",
      );
};
class jV {
  type;
  #A;
  #B;
  #Q = !1;
  #I = [];
  #G;
  #X;
  #Z;
  #F = !1;
  #W;
  #C;
  #J = !1;
  constructor(A, B, Q = {}) {
    if (((this.type = A), A)) this.#B = !0;
    if (
      ((this.#G = B),
      (this.#A = this.#G ? this.#G.#A : this),
      (this.#W = this.#A === this ? Q : this.#A.#W),
      (this.#Z = this.#A === this ? [] : this.#A.#Z),
      A === "!" && !this.#A.#F)
    )
      this.#Z.push(this);
    this.#X = this.#G ? this.#G.#I.length : 0;
  }
  get hasMagic() {
    if (this.#B !== void 0) return this.#B;
    for (let A of this.#I) {
      if (typeof A === "string") continue;
      if (A.type || A.hasMagic) return (this.#B = !0);
    }
    return this.#B;
  }
  toString() {
    if (this.#C !== void 0) return this.#C;
    if (!this.type) return (this.#C = this.#I.map((A) => String(A)).join(""));
    else
      return (this.#C =
        this.type + "(" + this.#I.map((A) => String(A)).join("|") + ")");
  }
  #z() {
    if (this !== this.#A) throw Error("should only call on root");
    if (this.#F) return this;
    (this.toString(), (this.#F = !0));
    let A;
    while ((A = this.#Z.pop())) {
      if (A.type !== "!") continue;
      let B = A,
        Q = B.#G;
      while (Q) {
        for (let I = B.#X + 1; !Q.type && I < Q.#I.length; I++)
          for (let G of A.#I) {
            if (typeof G === "string")
              throw Error("string part in extglob AST??");
            G.copyIn(Q.#I[I]);
          }
        ((B = Q), (Q = B.#G));
      }
    }
    return this;
  }
  push(...A) {
    for (let B of A) {
      if (B === "") continue;
      if (typeof B !== "string" && !(B instanceof jV && B.#G === this))
        throw Error("invalid part: " + B);
      this.#I.push(B);
    }
  }
  toJSON() {
    let A =
      this.type === null
        ? this.#I.slice().map((B) => (typeof B === "string" ? B : B.toJSON()))
        : [this.type, ...this.#I.map((B) => B.toJSON())];
    if (this.isStart() && !this.type) A.unshift([]);
    if (
      this.isEnd() &&
      (this === this.#A || (this.#A.#F && this.#G?.type === "!"))
    )
      A.push({});
    return A;
  }
  isStart() {
    if (this.#A === this) return !0;
    if (!this.#G?.isStart()) return !1;
    if (this.#X === 0) return !0;
    let A = this.#G;
    for (let B = 0; B < this.#X; B++) {
      let Q = A.#I[B];
      if (!(Q instanceof jV && Q.type === "!")) return !1;
    }
    return !0;
  }
  isEnd() {
    if (this.#A === this) return !0;
    if (this.#G?.type === "!") return !0;
    if (!this.#G?.isEnd()) return !1;
    if (!this.type) return this.#G?.isEnd();
    let A = this.#G ? this.#G.#I.length : 0;
    return this.#X === A - 1;
  }
  copyIn(A) {
    if (typeof A === "string") this.push(A);
    else this.push(A.clone(this));
  }
  clone(A) {
    let B = new jV(this.type, A);
    for (let Q of this.#I) B.copyIn(Q);
    return B;
  }
  static #U(A, B, Q, I) {
    let G = !1,
      Z = !1,
      Y = -1,
      J = !1;
    if (B.type === null) {
      let V = Q,
        K = "";
      while (V < A.length) {
        let D = A.charAt(V++);
        if (G || D === "\\") {
          ((G = !G), (K += D));
          continue;
        }
        if (Z) {
          if (V === Y + 1) {
            if (D === "^" || D === "!") J = !0;
          } else if (D === "]" && !(V === Y + 2 && J)) Z = !1;
          K += D;
          continue;
        } else if (D === "[") {
          ((Z = !0), (Y = V), (J = !1), (K += D));
          continue;
        }
        if (!I.noext && Ht2(D) && A.charAt(V) === "(") {
          (B.push(K), (K = ""));
          let E = new jV(D, B);
          ((V = jV.#U(A, E, V, I)), B.push(E));
          continue;
        }
        K += D;
      }
      return (B.push(K), V);
    }
    let X = Q + 1,
      W = new jV(null, B),
      F = [],
      C = "";
    while (X < A.length) {
      let V = A.charAt(X++);
      if (G || V === "\\") {
        ((G = !G), (C += V));
        continue;
      }
      if (Z) {
        if (X === Y + 1) {
          if (V === "^" || V === "!") J = !0;
        } else if (V === "]" && !(X === Y + 2 && J)) Z = !1;
        C += V;
        continue;
      } else if (V === "[") {
        ((Z = !0), (Y = X), (J = !1), (C += V));
        continue;
      }
      if (Ht2(V) && A.charAt(X) === "(") {
        (W.push(C), (C = ""));
        let K = new jV(V, W);
        (W.push(K), (X = jV.#U(A, K, X, I)));
        continue;
      }
      if (V === "|") {
        (W.push(C), (C = ""), F.push(W), (W = new jV(null, B)));
        continue;
      }
      if (V === ")") {
        if (C === "" && B.#I.length === 0) B.#J = !0;
        return (W.push(C), (C = ""), B.push(...F, W), X);
      }
      C += V;
    }
    return ((B.type = null), (B.#B = void 0), (B.#I = [A.substring(Q - 1)]), X);
  }
  static fromGlob(A, B = {}) {
    let Q = new jV(null, void 0, B);
    return (jV.#U(A, Q, 0, B), Q);
  }
  toMMPattern() {
    if (this !== this.#A) return this.#A.toMMPattern();
    let A = this.toString(),
      [B, Q, I, G] = this.toRegExpSource();
    if (
      !(
        I ||
        this.#B ||
        (this.#W.nocase &&
          !this.#W.nocaseMagicOnly &&
          A.toUpperCase() !== A.toLowerCase())
      )
    )
      return Q;
    let Y = (this.#W.nocase ? "i" : "") + (G ? "u" : "");
    return Object.assign(new RegExp(`^${B}$`, Y), { _src: B, _glob: A });
  }
  get options() {
    return this.#W;
  }
  toRegExpSource(A) {
    let B = A ?? !!this.#W.dot;
    if (this.#A === this) this.#z();
    if (!this.type) {
      let J = this.isStart() && this.isEnd(),
        X = this.#I
          .map((V) => {
            let [K, D, E, H] =
              typeof V === "string"
                ? jV.#K(V, this.#B, J)
                : V.toRegExpSource(A);
            return ((this.#B = this.#B || E), (this.#Q = this.#Q || H), K);
          })
          .join(""),
        W = "";
      if (this.isStart()) {
        if (typeof this.#I[0] === "string") {
          if (!(this.#I.length === 1 && h2I.has(this.#I[0]))) {
            let K = f2I,
              D =
                (B && K.has(X.charAt(0))) ||
                (X.startsWith("\\.") && K.has(X.charAt(2))) ||
                (X.startsWith("\\.\\.") && K.has(X.charAt(4))),
              E = !B && !A && K.has(X.charAt(0));
            W = D ? b2I : E ? SQ1 : "";
          }
        }
      }
      let F = "";
      if (this.isEnd() && this.#A.#F && this.#G?.type === "!") F = "(?:$|\\/)";
      return [W + X + F, fR(X), (this.#B = !!this.#B), this.#Q];
    }
    let Q = this.type === "*" || this.type === "+",
      I = this.type === "!" ? "(?:(?!(?:" : "(?:",
      G = this.#D(B);
    if (this.isStart() && this.isEnd() && !G && this.type !== "!") {
      let J = this.toString();
      return (
        (this.#I = [J]),
        (this.type = null),
        (this.#B = void 0),
        [J, fR(this.toString()), !1, !1]
      );
    }
    let Z = !Q || A || B || !SQ1 ? "" : this.#D(!0);
    if (Z === G) Z = "";
    if (Z) G = `(?:${G})(?:${Z})*?`;
    let Y = "";
    if (this.type === "!" && this.#J)
      Y = (this.isStart() && !B ? SQ1 : "") + Ut2;
    else {
      let J =
        this.type === "!"
          ? "))" + (this.isStart() && !B && !A ? SQ1 : "") + zt2 + ")"
          : this.type === "@"
            ? ")"
            : this.type === "?"
              ? ")?"
              : this.type === "+" && Z
                ? ")"
                : this.type === "*" && Z
                  ? ")?"
                  : `)${this.type}`;
      Y = I + G + J;
    }
    return [Y, fR(G), (this.#B = !!this.#B), this.#Q];
  }
  #D(A) {
    return this.#I
      .map((B) => {
        if (typeof B === "string") throw Error("string type in extglob ast??");
        let [Q, I, G, Z] = B.toRegExpSource(A);
        return ((this.#Q = this.#Q || Z), Q);
      })
      .filter((B) => !(this.isStart() && this.isEnd()) || !!B)
      .join("|");
  }
  static #K(A, B, Q = !1) {
    let I = !1,
      G = "",
      Z = !1;
    for (let Y = 0; Y < A.length; Y++) {
      let J = A.charAt(Y);
      if (I) {
        ((I = !1), (G += (g2I.has(J) ? "\\" : "") + J));
        continue;
      }
      if (J === "\\") {
        if (Y === A.length - 1) G += "\\\\";
        else I = !0;
        continue;
      }
      if (J === "[") {
        let [X, W, F, C] = Dt2(A, Y);
        if (F) {
          ((G += X), (Z = Z || W), (Y += F - 1), (B = B || C));
          continue;
        }
      }
      if (J === "*") {
        if (Q && A === "*") G += Ut2;
        else G += zt2;
        B = !0;
        continue;
      }
      if (J === "?") {
        ((G += AQ0), (B = !0));
        continue;
      }
      G += u2I(J);
    }
    return [G, fR(A), !!B, Z];
  }
}
var v2I,
  Ht2 = (A) => v2I.has(A),
  b2I = "(?!(?:^|/)\\.\\.?(?:$|/))",
  SQ1 = "(?!\\.)",
  f2I,
  h2I,
  g2I,
  u2I = (A) => A.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
  AQ0 = "[^/]",
  zt2,
  Ut2;
var BQ0 = T(() => {
  Et2();
  ((v2I = new Set(["!", "?", "+", "*", "@"])),
    (f2I = new Set(["[", "."])),
    (h2I = new Set(["..", "."])),
    (g2I = new Set("().*{}+?[]^$\\!")),
    (zt2 = AQ0 + "*?"),
    (Ut2 = AQ0 + "+?"));
});
var u7A = (A, { windowsPathsNoEscape: B = !1 } = {}) => {
  return B
    ? A.replace(/[?*()[\]]/g, "[$&]")
    : A.replace(/[?*()[\]\\]/g, "\\$&");
};
class jL {
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  regexp;
  constructor(A, B = {}) {
    if (
      (CqA(A),
      (B = B || {}),
      (this.options = B),
      (this.pattern = A),
      (this.platform = B.platform || Mt2),
      (this.isWindows = this.platform === "win32"),
      (this.windowsPathsNoEscape =
        !!B.windowsPathsNoEscape || B.allowWindowsEscape === !1),
      this.windowsPathsNoEscape)
    )
      this.pattern = this.pattern.replace(/\\/g, "/");
    ((this.preserveMultipleSlashes = !!B.preserveMultipleSlashes),
      (this.regexp = null),
      (this.negate = !1),
      (this.nonegate = !!B.nonegate),
      (this.comment = !1),
      (this.empty = !1),
      (this.partial = !!B.partial),
      (this.nocase = !!this.options.nocase),
      (this.windowsNoMagicRoot =
        B.windowsNoMagicRoot !== void 0
          ? B.windowsNoMagicRoot
          : !!(this.isWindows && this.nocase)),
      (this.globSet = []),
      (this.globParts = []),
      (this.set = []),
      this.make());
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) return !0;
    for (let A of this.set)
      for (let B of A) if (typeof B !== "string") return !0;
    return !1;
  }
  debug(...A) {}
  make() {
    let A = this.pattern,
      B = this.options;
    if (!B.nocomment && A.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!A) {
      this.empty = !0;
      return;
    }
    if (
      (this.parseNegate(),
      (this.globSet = [...new Set(this.braceExpand())]),
      B.debug)
    )
      this.debug = (...G) => console.error(...G);
    this.debug(this.pattern, this.globSet);
    let Q = this.globSet.map((G) => this.slashSplit(G));
    ((this.globParts = this.preprocess(Q)),
      this.debug(this.pattern, this.globParts));
    let I = this.globParts.map((G, Z, Y) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        let J =
            G[0] === "" &&
            G[1] === "" &&
            (G[2] === "?" || !$t2.test(G[2])) &&
            !$t2.test(G[3]),
          X = /^[a-z]:/i.test(G[0]);
        if (J)
          return [...G.slice(0, 4), ...G.slice(4).map((W) => this.parse(W))];
        else if (X) return [G[0], ...G.slice(1).map((W) => this.parse(W))];
      }
      return G.map((J) => this.parse(J));
    });
    if (
      (this.debug(this.pattern, I),
      (this.set = I.filter((G) => G.indexOf(!1) === -1)),
      this.isWindows)
    )
      for (let G = 0; G < this.set.length; G++) {
        let Z = this.set[G];
        if (
          Z[0] === "" &&
          Z[1] === "" &&
          this.globParts[G][2] === "?" &&
          typeof Z[3] === "string" &&
          /^[a-z]:$/i.test(Z[3])
        )
          Z[2] = "?";
      }
    this.debug(this.pattern, this.set);
  }
  preprocess(A) {
    if (this.options.noglobstar) {
      for (let Q = 0; Q < A.length; Q++)
        for (let I = 0; I < A[Q].length; I++)
          if (A[Q][I] === "**") A[Q][I] = "*";
    }
    let { optimizationLevel: B = 1 } = this.options;
    if (B >= 2)
      ((A = this.firstPhasePreProcess(A)), (A = this.secondPhasePreProcess(A)));
    else if (B >= 1) A = this.levelOneOptimize(A);
    else A = this.adjascentGlobstarOptimize(A);
    return A;
  }
  adjascentGlobstarOptimize(A) {
    return A.map((B) => {
      let Q = -1;
      while ((Q = B.indexOf("**", Q + 1)) !== -1) {
        let I = Q;
        while (B[I + 1] === "**") I++;
        if (I !== Q) B.splice(Q, I - Q);
      }
      return B;
    });
  }
  levelOneOptimize(A) {
    return A.map((B) => {
      return (
        (B = B.reduce((Q, I) => {
          let G = Q[Q.length - 1];
          if (I === "**" && G === "**") return Q;
          if (I === "..") {
            if (G && G !== ".." && G !== "." && G !== "**") return (Q.pop(), Q);
          }
          return (Q.push(I), Q);
        }, [])),
        B.length === 0 ? [""] : B
      );
    });
  }
  levelTwoFileOptimize(A) {
    if (!Array.isArray(A)) A = this.slashSplit(A);
    let B = !1;
    do {
      if (((B = !1), !this.preserveMultipleSlashes)) {
        for (let I = 1; I < A.length - 1; I++) {
          let G = A[I];
          if (I === 1 && G === "" && A[0] === "") continue;
          if (G === "." || G === "") ((B = !0), A.splice(I, 1), I--);
        }
        if (A[0] === "." && A.length === 2 && (A[1] === "." || A[1] === ""))
          ((B = !0), A.pop());
      }
      let Q = 0;
      while ((Q = A.indexOf("..", Q + 1)) !== -1) {
        let I = A[Q - 1];
        if (I && I !== "." && I !== ".." && I !== "**")
          ((B = !0), A.splice(Q - 1, 2), (Q -= 2));
      }
    } while (B);
    return A.length === 0 ? [""] : A;
  }
  firstPhasePreProcess(A) {
    let B = !1;
    do {
      B = !1;
      for (let Q of A) {
        let I = -1;
        while ((I = Q.indexOf("**", I + 1)) !== -1) {
          let Z = I;
          while (Q[Z + 1] === "**") Z++;
          if (Z > I) Q.splice(I + 1, Z - I);
          let Y = Q[I + 1],
            J = Q[I + 2],
            X = Q[I + 3];
          if (Y !== "..") continue;
          if (!J || J === "." || J === ".." || !X || X === "." || X === "..")
            continue;
          ((B = !0), Q.splice(I, 1));
          let W = Q.slice(0);
          ((W[I] = "**"), A.push(W), I--);
        }
        if (!this.preserveMultipleSlashes) {
          for (let Z = 1; Z < Q.length - 1; Z++) {
            let Y = Q[Z];
            if (Z === 1 && Y === "" && Q[0] === "") continue;
            if (Y === "." || Y === "") ((B = !0), Q.splice(Z, 1), Z--);
          }
          if (Q[0] === "." && Q.length === 2 && (Q[1] === "." || Q[1] === ""))
            ((B = !0), Q.pop());
        }
        let G = 0;
        while ((G = Q.indexOf("..", G + 1)) !== -1) {
          let Z = Q[G - 1];
          if (Z && Z !== "." && Z !== ".." && Z !== "**") {
            B = !0;
            let J = G === 1 && Q[G + 1] === "**" ? ["."] : [];
            if ((Q.splice(G - 1, 2, ...J), Q.length === 0)) Q.push("");
            G -= 2;
          }
        }
      }
    } while (B);
    return A;
  }
  secondPhasePreProcess(A) {
    for (let B = 0; B < A.length - 1; B++)
      for (let Q = B + 1; Q < A.length; Q++) {
        let I = this.partsMatch(A[B], A[Q], !this.preserveMultipleSlashes);
        if (I) {
          ((A[B] = []), (A[Q] = I));
          break;
        }
      }
    return A.filter((B) => B.length);
  }
  partsMatch(A, B, Q = !1) {
    let I = 0,
      G = 0,
      Z = [],
      Y = "";
    while (I < A.length && G < B.length)
      if (A[I] === B[G]) (Z.push(Y === "b" ? B[G] : A[I]), I++, G++);
      else if (Q && A[I] === "**" && B[G] === A[I + 1]) (Z.push(A[I]), I++);
      else if (Q && B[G] === "**" && A[I] === B[G + 1]) (Z.push(B[G]), G++);
      else if (
        A[I] === "*" &&
        B[G] &&
        (this.options.dot || !B[G].startsWith(".")) &&
        B[G] !== "**"
      ) {
        if (Y === "b") return !1;
        ((Y = "a"), Z.push(A[I]), I++, G++);
      } else if (
        B[G] === "*" &&
        A[I] &&
        (this.options.dot || !A[I].startsWith(".")) &&
        A[I] !== "**"
      ) {
        if (Y === "a") return !1;
        ((Y = "b"), Z.push(B[G]), I++, G++);
      } else return !1;
    return A.length === B.length && Z;
  }
  parseNegate() {
    if (this.nonegate) return;
    let A = this.pattern,
      B = !1,
      Q = 0;
    for (let I = 0; I < A.length && A.charAt(I) === "!"; I++) ((B = !B), Q++);
    if (Q) this.pattern = A.slice(Q);
    this.negate = B;
  }
  matchOne(A, B, Q = !1) {
    let I = this.options;
    if (this.isWindows) {
      let D = typeof A[0] === "string" && /^[a-z]:$/i.test(A[0]),
        E =
          !D &&
          A[0] === "" &&
          A[1] === "" &&
          A[2] === "?" &&
          /^[a-z]:$/i.test(A[3]),
        H = typeof B[0] === "string" && /^[a-z]:$/i.test(B[0]),
        w =
          !H &&
          B[0] === "" &&
          B[1] === "" &&
          B[2] === "?" &&
          typeof B[3] === "string" &&
          /^[a-z]:$/i.test(B[3]),
        L = E ? 3 : D ? 0 : void 0,
        N = w ? 3 : H ? 0 : void 0;
      if (typeof L === "number" && typeof N === "number") {
        let [$, O] = [A[L], B[N]];
        if ($.toLowerCase() === O.toLowerCase()) {
          if (((B[N] = $), N > L)) B = B.slice(N);
          else if (L > N) A = A.slice(L);
        }
      }
    }
    let { optimizationLevel: G = 1 } = this.options;
    if (G >= 2) A = this.levelTwoFileOptimize(A);
    (this.debug("matchOne", this, { file: A, pattern: B }),
      this.debug("matchOne", A.length, B.length));
    for (
      var Z = 0, Y = 0, J = A.length, X = B.length;
      Z < J && Y < X;
      Z++, Y++
    ) {
      this.debug("matchOne loop");
      var W = B[Y],
        F = A[Z];
      if ((this.debug(B, W, F), W === !1)) return !1;
      if (W === SV) {
        this.debug("GLOBSTAR", [B, W, F]);
        var C = Z,
          V = Y + 1;
        if (V === X) {
          this.debug("** at the end");
          for (; Z < J; Z++)
            if (
              A[Z] === "." ||
              A[Z] === ".." ||
              (!I.dot && A[Z].charAt(0) === ".")
            )
              return !1;
          return !0;
        }
        while (C < J) {
          var K = A[C];
          if (
            (this.debug(
              `
globstar while`,
              A,
              C,
              B,
              V,
              K,
            ),
            this.matchOne(A.slice(C), B.slice(V), Q))
          )
            return (this.debug("globstar found match!", C, J, K), !0);
          else {
            if (K === "." || K === ".." || (!I.dot && K.charAt(0) === ".")) {
              this.debug("dot detected!", A, C, B, V);
              break;
            }
            (this.debug("globstar swallow a segment, and continue"), C++);
          }
        }
        if (Q) {
          if (
            (this.debug(
              `
>>> no match, partial?`,
              A,
              C,
              B,
              V,
            ),
            C === J)
          )
            return !0;
        }
        return !1;
      }
      let D;
      if (typeof W === "string")
        ((D = F === W), this.debug("string match", W, F, D));
      else ((D = W.test(F)), this.debug("pattern match", W, F, D));
      if (!D) return !1;
    }
    if (Z === J && Y === X) return !0;
    else if (Z === J) return Q;
    else if (Y === X) return Z === J - 1 && A[Z] === "";
    else throw Error("wtf?");
  }
  braceExpand() {
    return Ot2(this.pattern, this.options);
  }
  parse(A) {
    CqA(A);
    let B = this.options;
    if (A === "**") return SV;
    if (A === "") return "";
    let Q,
      I = null;
    if ((Q = A.match(o2I))) I = B.dot ? e2I : t2I;
    else if ((Q = A.match(m2I)))
      I = (B.nocase ? (B.dot ? l2I : p2I) : B.dot ? c2I : d2I)(Q[1]);
    else if ((Q = A.match(A9I)))
      I = (B.nocase ? (B.dot ? Q9I : B9I) : B.dot ? I9I : G9I)(Q);
    else if ((Q = A.match(i2I))) I = B.dot ? a2I : n2I;
    else if ((Q = A.match(s2I))) I = r2I;
    let G = jV.fromGlob(A, this.options).toMMPattern();
    if (I && typeof G === "object")
      Reflect.defineProperty(G, "test", { value: I });
    return G;
  }
  makeRe() {
    if (this.regexp || this.regexp === !1) return this.regexp;
    let A = this.set;
    if (!A.length) return ((this.regexp = !1), this.regexp);
    let B = this.options,
      Q = B.noglobstar ? J9I : B.dot ? X9I : W9I,
      I = new Set(B.nocase ? ["i"] : []),
      G = A.map((J) => {
        let X = J.map((W) => {
          if (W instanceof RegExp) for (let F of W.flags.split("")) I.add(F);
          return typeof W === "string" ? D9I(W) : W === SV ? SV : W._src;
        });
        return (
          X.forEach((W, F) => {
            let C = X[F + 1],
              V = X[F - 1];
            if (W !== SV || V === SV) return;
            if (V === void 0)
              if (C !== void 0 && C !== SV)
                X[F + 1] = "(?:\\/|" + Q + "\\/)?" + C;
              else X[F] = Q;
            else if (C === void 0) X[F - 1] = V + "(?:\\/|" + Q + ")?";
            else if (C !== SV)
              ((X[F - 1] = V + "(?:\\/|\\/" + Q + "\\/)" + C), (X[F + 1] = SV));
          }),
          X.filter((W) => W !== SV).join("/")
        );
      }).join("|"),
      [Z, Y] = A.length > 1 ? ["(?:", ")"] : ["", ""];
    if (((G = "^" + Z + G + Y + "$"), this.negate)) G = "^(?!" + G + ").+$";
    try {
      this.regexp = new RegExp(G, [...I].join(""));
    } catch (J) {
      this.regexp = !1;
    }
    return this.regexp;
  }
  slashSplit(A) {
    if (this.preserveMultipleSlashes) return A.split("/");
    else if (this.isWindows && /^\/\/[^\/]+/.test(A))
      return ["", ...A.split(/\/+/)];
    else return A.split(/\/+/);
  }
  match(A, B = this.partial) {
    if ((this.debug("match", A, this.pattern), this.comment)) return !1;
    if (this.empty) return A === "";
    if (A === "/" && B) return !0;
    let Q = this.options;
    if (this.isWindows) A = A.split("\\").join("/");
    let I = this.slashSplit(A);
    this.debug(this.pattern, "split", I);
    let G = this.set;
    this.debug(this.pattern, "set", G);
    let Z = I[I.length - 1];
    if (!Z) for (let Y = I.length - 2; !Z && Y >= 0; Y--) Z = I[Y];
    for (let Y = 0; Y < G.length; Y++) {
      let J = G[Y],
        X = I;
      if (Q.matchBase && J.length === 1) X = [Z];
      if (this.matchOne(X, J, B)) {
        if (Q.flipNegate) return !0;
        return !this.negate;
      }
    }
    if (Q.flipNegate) return !1;
    return this.negate;
  }
  static defaults(A) {
    return LE.defaults(A).Minimatch;
  }
}
var qt2,
  LE = (A, B, Q = {}) => {
    if ((CqA(B), !Q.nocomment && B.charAt(0) === "#")) return !1;
    return new jL(B, Q).match(A);
  },
  m2I,
  d2I = (A) => (B) => !B.startsWith(".") && B.endsWith(A),
  c2I = (A) => (B) => B.endsWith(A),
  p2I = (A) => {
    return (
      (A = A.toLowerCase()),
      (B) => !B.startsWith(".") && B.toLowerCase().endsWith(A)
    );
  },
  l2I = (A) => {
    return ((A = A.toLowerCase()), (B) => B.toLowerCase().endsWith(A));
  },
  i2I,
  n2I = (A) => !A.startsWith(".") && A.includes("."),
  a2I = (A) => A !== "." && A !== ".." && A.includes("."),
  s2I,
  r2I = (A) => A !== "." && A !== ".." && A.startsWith("."),
  o2I,
  t2I = (A) => A.length !== 0 && !A.startsWith("."),
  e2I = (A) => A.length !== 0 && A !== "." && A !== "..",
  A9I,
  B9I = ([A, B = ""]) => {
    let Q = Nt2([A]);
    if (!B) return Q;
    return ((B = B.toLowerCase()), (I) => Q(I) && I.toLowerCase().endsWith(B));
  },
  Q9I = ([A, B = ""]) => {
    let Q = Lt2([A]);
    if (!B) return Q;
    return ((B = B.toLowerCase()), (I) => Q(I) && I.toLowerCase().endsWith(B));
  },
  I9I = ([A, B = ""]) => {
    let Q = Lt2([A]);
    return !B ? Q : (I) => Q(I) && I.endsWith(B);
  },
  G9I = ([A, B = ""]) => {
    let Q = Nt2([A]);
    return !B ? Q : (I) => Q(I) && I.endsWith(B);
  },
  Nt2 = ([A]) => {
    let B = A.length;
    return (Q) => Q.length === B && !Q.startsWith(".");
  },
  Lt2 = ([A]) => {
    let B = A.length;
    return (Q) => Q.length === B && Q !== "." && Q !== "..";
  },
  Mt2,
  wt2,
  Z9I,
  SV,
  Y9I = "[^/]",
  J9I,
  X9I = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?",
  W9I = "(?:(?!(?:\\/|^)\\.).)*?",
  F9I =
    (A, B = {}) =>
    (Q) =>
      LE(Q, A, B),
  PL = (A, B = {}) => Object.assign({}, A, B),
  C9I = (A) => {
    if (!A || typeof A !== "object" || !Object.keys(A).length) return LE;
    let B = LE;
    return Object.assign((I, G, Z = {}) => B(I, G, PL(A, Z)), {
      Minimatch: class extends B.Minimatch {
        constructor(G, Z = {}) {
          super(G, PL(A, Z));
        }
        static defaults(G) {
          return B.defaults(PL(A, G)).Minimatch;
        }
      },
      AST: class extends B.AST {
        constructor(G, Z, Y = {}) {
          super(G, Z, PL(A, Y));
        }
        static fromGlob(G, Z = {}) {
          return B.AST.fromGlob(G, PL(A, Z));
        }
      },
      unescape: (I, G = {}) => B.unescape(I, PL(A, G)),
      escape: (I, G = {}) => B.escape(I, PL(A, G)),
      filter: (I, G = {}) => B.filter(I, PL(A, G)),
      defaults: (I) => B.defaults(PL(A, I)),
      makeRe: (I, G = {}) => B.makeRe(I, PL(A, G)),
      braceExpand: (I, G = {}) => B.braceExpand(I, PL(A, G)),
      match: (I, G, Z = {}) => B.match(I, G, PL(A, Z)),
      sep: B.sep,
      GLOBSTAR: SV,
    });
  },
  Ot2 = (A, B = {}) => {
    if ((CqA(A), B.nobrace || !/\{(?:(?!\{).)*\}/.test(A))) return [A];
    return qt2.default(A);
  },
  V9I = (A, B = {}) => new jL(A, B).makeRe(),
  K9I = (A, B, Q = {}) => {
    let I = new jL(B, Q);
    if (((A = A.filter((G) => I.match(G))), I.options.nonull && !A.length))
      A.push(B);
    return A;
  },
  $t2,
  D9I = (A) => A.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var Cp = T(() => {
  BQ0();
  BQ0();
  ((qt2 = IA(Vt2(), 1)),
    (m2I = /^\*+([^+@!?\*\[\(]*)$/),
    (i2I = /^\*+\.\*+$/),
    (s2I = /^\.\*+$/),
    (o2I = /^\*+$/),
    (A9I = /^\?+([^+@!?\*\[\(]*)?$/),
    (Mt2 =
      typeof process === "object" && process
        ? (typeof process.env === "object" &&
            process.env &&
            process.env.__MINIMATCH_TESTING_PLATFORM__) ||
          process.platform
        : "posix"),
    (wt2 = { win32: { sep: "\\" }, posix: { sep: "/" } }),
    (Z9I = Mt2 === "win32" ? wt2.win32.sep : wt2.posix.sep));
  LE.sep = Z9I;
  SV = Symbol("globstar **");
  LE.GLOBSTAR = SV;
  J9I = Y9I + "*?";
  LE.filter = F9I;
  LE.defaults = C9I;
  LE.braceExpand = Ot2;
  LE.makeRe = V9I;
  LE.match = K9I;
  $t2 = /[?*]|[+@!]\(.*?\)|\[|\]/;
  LE.AST = jV;
  LE.Minimatch = jL;
  LE.escape = u7A;
  LE.unescape = fR;
});
import { EventEmitter as JQ0 } from "node:events";
import St2 from "node:stream";
import { StringDecoder as E9I } from "node:string_decoder";
class XQ0 {
  src;
  dest;
  opts;
  ondrain;
  constructor(A, B, Q) {
    ((this.src = A),
      (this.dest = B),
      (this.opts = Q),
      (this.ondrain = () => A[d7A]()),
      this.dest.on("drain", this.ondrain));
  }
  unpipe() {
    this.dest.removeListener("drain", this.ondrain);
  }
  proxyErrors(A) {}
  end() {
    if ((this.unpipe(), this.opts.end)) this.dest.end();
  }
}
var Rt2,
  H9I = (A) =>
    !!A &&
    typeof A === "object" &&
    (A instanceof Lt || A instanceof St2 || z9I(A) || U9I(A)),
  z9I = (A) =>
    !!A &&
    typeof A === "object" &&
    A instanceof JQ0 &&
    typeof A.pipe === "function" &&
    A.pipe !== St2.Writable.prototype.pipe,
  U9I = (A) =>
    !!A &&
    typeof A === "object" &&
    A instanceof JQ0 &&
    typeof A.write === "function" &&
    typeof A.end === "function",
  _b,
  xb,
  Vp,
  yQ1,
  KqA,
  kQ1,
  Tt2,
  _Q1,
  Pt2,
  hR,
  m7A,
  BC,
  DqA,
  d7A,
  QC,
  ME,
  IC,
  QQ0,
  xQ1,
  QD,
  bJ,
  IQ0,
  GQ0,
  jt2,
  ZQ0,
  Ly,
  YQ0,
  vQ1,
  EqA,
  Nt,
  ow,
  HqA = (A) => Promise.resolve().then(A),
  w9I = (A) => A(),
  $9I = (A) => A === "end" || A === "finish" || A === "prefinish",
  q9I = (A) =>
    A instanceof ArrayBuffer ||
    (!!A &&
      typeof A === "object" &&
      A.constructor &&
      A.constructor.name === "ArrayBuffer" &&
      A.byteLength >= 0),
  N9I = (A) => !Buffer.isBuffer(A) && ArrayBuffer.isView(A),
  yt2,
  L9I = (A) => !!A.objectMode,
  M9I = (A) => !A.objectMode && !!A.encoding && A.encoding !== "buffer",
  Lt;
var WQ0 = T(() => {
  ((Rt2 =
    typeof process === "object" && process
      ? process
      : { stdout: null, stderr: null }),
    (_b = Symbol("EOF")),
    (xb = Symbol("maybeEmitEnd")),
    (Vp = Symbol("emittedEnd")),
    (yQ1 = Symbol("emittingEnd")),
    (KqA = Symbol("emittedError")),
    (kQ1 = Symbol("closed")),
    (Tt2 = Symbol("read")),
    (_Q1 = Symbol("flush")),
    (Pt2 = Symbol("flushChunk")),
    (hR = Symbol("encoding")),
    (m7A = Symbol("decoder")),
    (BC = Symbol("flowing")),
    (DqA = Symbol("paused")),
    (d7A = Symbol("resume")),
    (QC = Symbol("buffer")),
    (ME = Symbol("pipes")),
    (IC = Symbol("bufferLength")),
    (QQ0 = Symbol("bufferPush")),
    (xQ1 = Symbol("bufferShift")),
    (QD = Symbol("objectMode")),
    (bJ = Symbol("destroyed")),
    (IQ0 = Symbol("error")),
    (GQ0 = Symbol("emitData")),
    (jt2 = Symbol("emitEnd")),
    (ZQ0 = Symbol("emitEnd2")),
    (Ly = Symbol("async")),
    (YQ0 = Symbol("abort")),
    (vQ1 = Symbol("aborted")),
    (EqA = Symbol("signal")),
    (Nt = Symbol("dataListeners")),
    (ow = Symbol("discarded")));
  yt2 = class yt2 extends XQ0 {
    unpipe() {
      (this.src.removeListener("error", this.proxyErrors), super.unpipe());
    }
    constructor(A, B, Q) {
      super(A, B, Q);
      ((this.proxyErrors = (I) => B.emit("error", I)),
        A.on("error", this.proxyErrors));
    }
  };
  Lt = class Lt extends JQ0 {
    [BC] = !1;
    [DqA] = !1;
    [ME] = [];
    [QC] = [];
    [QD];
    [hR];
    [Ly];
    [m7A];
    [_b] = !1;
    [Vp] = !1;
    [yQ1] = !1;
    [kQ1] = !1;
    [KqA] = null;
    [IC] = 0;
    [bJ] = !1;
    [EqA];
    [vQ1] = !1;
    [Nt] = 0;
    [ow] = !1;
    writable = !0;
    readable = !0;
    constructor(...A) {
      let B = A[0] || {};
      super();
      if (B.objectMode && typeof B.encoding === "string")
        throw TypeError("Encoding and objectMode may not be used together");
      if (L9I(B)) ((this[QD] = !0), (this[hR] = null));
      else if (M9I(B)) ((this[hR] = B.encoding), (this[QD] = !1));
      else ((this[QD] = !1), (this[hR] = null));
      if (
        ((this[Ly] = !!B.async),
        (this[m7A] = this[hR] ? new E9I(this[hR]) : null),
        B && B.debugExposeBuffer === !0)
      )
        Object.defineProperty(this, "buffer", { get: () => this[QC] });
      if (B && B.debugExposePipes === !0)
        Object.defineProperty(this, "pipes", { get: () => this[ME] });
      let { signal: Q } = B;
      if (Q)
        if (((this[EqA] = Q), Q.aborted)) this[YQ0]();
        else Q.addEventListener("abort", () => this[YQ0]());
    }
    get bufferLength() {
      return this[IC];
    }
    get encoding() {
      return this[hR];
    }
    set encoding(A) {
      throw Error("Encoding must be set at instantiation time");
    }
    setEncoding(A) {
      throw Error("Encoding must be set at instantiation time");
    }
    get objectMode() {
      return this[QD];
    }
    set objectMode(A) {
      throw Error("objectMode must be set at instantiation time");
    }
    get ["async"]() {
      return this[Ly];
    }
    set ["async"](A) {
      this[Ly] = this[Ly] || !!A;
    }
    [YQ0]() {
      ((this[vQ1] = !0),
        this.emit("abort", this[EqA]?.reason),
        this.destroy(this[EqA]?.reason));
    }
    get aborted() {
      return this[vQ1];
    }
    set aborted(A) {}
    write(A, B, Q) {
      if (this[vQ1]) return !1;
      if (this[_b]) throw Error("write after end");
      if (this[bJ])
        return (
          this.emit(
            "error",
            Object.assign(
              Error("Cannot call write after a stream was destroyed"),
              { code: "ERR_STREAM_DESTROYED" },
            ),
          ),
          !0
        );
      if (typeof B === "function") ((Q = B), (B = "utf8"));
      if (!B) B = "utf8";
      let I = this[Ly] ? HqA : w9I;
      if (!this[QD] && !Buffer.isBuffer(A)) {
        if (N9I(A)) A = Buffer.from(A.buffer, A.byteOffset, A.byteLength);
        else if (q9I(A)) A = Buffer.from(A);
        else if (typeof A !== "string")
          throw Error("Non-contiguous data written to non-objectMode stream");
      }
      if (this[QD]) {
        if (this[BC] && this[IC] !== 0) this[_Q1](!0);
        if (this[BC]) this.emit("data", A);
        else this[QQ0](A);
        if (this[IC] !== 0) this.emit("readable");
        if (Q) I(Q);
        return this[BC];
      }
      if (!A.length) {
        if (this[IC] !== 0) this.emit("readable");
        if (Q) I(Q);
        return this[BC];
      }
      if (typeof A === "string" && !(B === this[hR] && !this[m7A]?.lastNeed))
        A = Buffer.from(A, B);
      if (Buffer.isBuffer(A) && this[hR]) A = this[m7A].write(A);
      if (this[BC] && this[IC] !== 0) this[_Q1](!0);
      if (this[BC]) this.emit("data", A);
      else this[QQ0](A);
      if (this[IC] !== 0) this.emit("readable");
      if (Q) I(Q);
      return this[BC];
    }
    read(A) {
      if (this[bJ]) return null;
      if (((this[ow] = !1), this[IC] === 0 || A === 0 || (A && A > this[IC])))
        return (this[xb](), null);
      if (this[QD]) A = null;
      if (this[QC].length > 1 && !this[QD])
        this[QC] = [
          this[hR] ? this[QC].join("") : Buffer.concat(this[QC], this[IC]),
        ];
      let B = this[Tt2](A || null, this[QC][0]);
      return (this[xb](), B);
    }
    [Tt2](A, B) {
      if (this[QD]) this[xQ1]();
      else {
        let Q = B;
        if (A === Q.length || A === null) this[xQ1]();
        else if (typeof Q === "string")
          ((this[QC][0] = Q.slice(A)), (B = Q.slice(0, A)), (this[IC] -= A));
        else
          ((this[QC][0] = Q.subarray(A)),
            (B = Q.subarray(0, A)),
            (this[IC] -= A));
      }
      if ((this.emit("data", B), !this[QC].length && !this[_b]))
        this.emit("drain");
      return B;
    }
    end(A, B, Q) {
      if (typeof A === "function") ((Q = A), (A = void 0));
      if (typeof B === "function") ((Q = B), (B = "utf8"));
      if (A !== void 0) this.write(A, B);
      if (Q) this.once("end", Q);
      if (((this[_b] = !0), (this.writable = !1), this[BC] || !this[DqA]))
        this[xb]();
      return this;
    }
    [d7A]() {
      if (this[bJ]) return;
      if (!this[Nt] && !this[ME].length) this[ow] = !0;
      if (
        ((this[DqA] = !1),
        (this[BC] = !0),
        this.emit("resume"),
        this[QC].length)
      )
        this[_Q1]();
      else if (this[_b]) this[xb]();
      else this.emit("drain");
    }
    resume() {
      return this[d7A]();
    }
    pause() {
      ((this[BC] = !1), (this[DqA] = !0), (this[ow] = !1));
    }
    get destroyed() {
      return this[bJ];
    }
    get flowing() {
      return this[BC];
    }
    get paused() {
      return this[DqA];
    }
    [QQ0](A) {
      if (this[QD]) this[IC] += 1;
      else this[IC] += A.length;
      this[QC].push(A);
    }
    [xQ1]() {
      if (this[QD]) this[IC] -= 1;
      else this[IC] -= this[QC][0].length;
      return this[QC].shift();
    }
    [_Q1](A = !1) {
      do;
      while (this[Pt2](this[xQ1]()) && this[QC].length);
      if (!A && !this[QC].length && !this[_b]) this.emit("drain");
    }
    [Pt2](A) {
      return (this.emit("data", A), this[BC]);
    }
    pipe(A, B) {
      if (this[bJ]) return A;
      this[ow] = !1;
      let Q = this[Vp];
      if (((B = B || {}), A === Rt2.stdout || A === Rt2.stderr)) B.end = !1;
      else B.end = B.end !== !1;
      if (((B.proxyErrors = !!B.proxyErrors), Q)) {
        if (B.end) A.end();
      } else if (
        (this[ME].push(
          !B.proxyErrors ? new XQ0(this, A, B) : new yt2(this, A, B),
        ),
        this[Ly])
      )
        HqA(() => this[d7A]());
      else this[d7A]();
      return A;
    }
    unpipe(A) {
      let B = this[ME].find((Q) => Q.dest === A);
      if (B) {
        if (this[ME].length === 1) {
          if (this[BC] && this[Nt] === 0) this[BC] = !1;
          this[ME] = [];
        } else this[ME].splice(this[ME].indexOf(B), 1);
        B.unpipe();
      }
    }
    addListener(A, B) {
      return this.on(A, B);
    }
    on(A, B) {
      let Q = super.on(A, B);
      if (A === "data") {
        if (((this[ow] = !1), this[Nt]++, !this[ME].length && !this[BC]))
          this[d7A]();
      } else if (A === "readable" && this[IC] !== 0) super.emit("readable");
      else if ($9I(A) && this[Vp]) (super.emit(A), this.removeAllListeners(A));
      else if (A === "error" && this[KqA]) {
        let I = B;
        if (this[Ly]) HqA(() => I.call(this, this[KqA]));
        else I.call(this, this[KqA]);
      }
      return Q;
    }
    removeListener(A, B) {
      return this.off(A, B);
    }
    off(A, B) {
      let Q = super.off(A, B);
      if (A === "data") {
        if (
          ((this[Nt] = this.listeners("data").length),
          this[Nt] === 0 && !this[ow] && !this[ME].length)
        )
          this[BC] = !1;
      }
      return Q;
    }
    removeAllListeners(A) {
      let B = super.removeAllListeners(A);
      if (A === "data" || A === void 0) {
        if (((this[Nt] = 0), !this[ow] && !this[ME].length)) this[BC] = !1;
      }
      return B;
    }
    get emittedEnd() {
      return this[Vp];
    }
    [xb]() {
      if (
        !this[yQ1] &&
        !this[Vp] &&
        !this[bJ] &&
        this[QC].length === 0 &&
        this[_b]
      ) {
        if (
          ((this[yQ1] = !0),
          this.emit("end"),
          this.emit("prefinish"),
          this.emit("finish"),
          this[kQ1])
        )
          this.emit("close");
        this[yQ1] = !1;
      }
    }
    emit(A, ...B) {
      let Q = B[0];
      if (A !== "error" && A !== "close" && A !== bJ && this[bJ]) return !1;
      else if (A === "data")
        return !this[QD] && !Q
          ? !1
          : this[Ly]
            ? (HqA(() => this[GQ0](Q)), !0)
            : this[GQ0](Q);
      else if (A === "end") return this[jt2]();
      else if (A === "close") {
        if (((this[kQ1] = !0), !this[Vp] && !this[bJ])) return !1;
        let G = super.emit("close");
        return (this.removeAllListeners("close"), G);
      } else if (A === "error") {
        ((this[KqA] = Q), super.emit(IQ0, Q));
        let G =
          !this[EqA] || this.listeners("error").length
            ? super.emit("error", Q)
            : !1;
        return (this[xb](), G);
      } else if (A === "resume") {
        let G = super.emit("resume");
        return (this[xb](), G);
      } else if (A === "finish" || A === "prefinish") {
        let G = super.emit(A);
        return (this.removeAllListeners(A), G);
      }
      let I = super.emit(A, ...B);
      return (this[xb](), I);
    }
    [GQ0](A) {
      for (let Q of this[ME]) if (Q.dest.write(A) === !1) this.pause();
      let B = this[ow] ? !1 : super.emit("data", A);
      return (this[xb](), B);
    }
    [jt2]() {
      if (this[Vp]) return !1;
      return (
        (this[Vp] = !0),
        (this.readable = !1),
        this[Ly] ? (HqA(() => this[ZQ0]()), !0) : this[ZQ0]()
      );
    }
    [ZQ0]() {
      if (this[m7A]) {
        let B = this[m7A].end();
        if (B) {
          for (let Q of this[ME]) Q.dest.write(B);
          if (!this[ow]) super.emit("data", B);
        }
      }
      for (let B of this[ME]) B.end();
      let A = super.emit("end");
      return (this.removeAllListeners("end"), A);
    }
    async collect() {
      let A = Object.assign([], { dataLength: 0 });
      if (!this[QD]) A.dataLength = 0;
      let B = this.promise();
      return (
        this.on("data", (Q) => {
          if ((A.push(Q), !this[QD])) A.dataLength += Q.length;
        }),
        await B,
        A
      );
    }
    async concat() {
      if (this[QD]) throw Error("cannot concat in objectMode");
      let A = await this.collect();
      return this[hR] ? A.join("") : Buffer.concat(A, A.dataLength);
    }
    async promise() {
      return new Promise((A, B) => {
        (this.on(bJ, () => B(Error("stream destroyed"))),
          this.on("error", (Q) => B(Q)),
          this.on("end", () => A()));
      });
    }
    [Symbol.asyncIterator]() {
      this[ow] = !1;
      let A = !1,
        B = async () => {
          return (this.pause(), (A = !0), { value: void 0, done: !0 });
        };
      return {
        next: () => {
          if (A) return B();
          let I = this.read();
          if (I !== null) return Promise.resolve({ done: !1, value: I });
          if (this[_b]) return B();
          let G,
            Z,
            Y = (F) => {
              (this.off("data", J),
                this.off("end", X),
                this.off(bJ, W),
                B(),
                Z(F));
            },
            J = (F) => {
              (this.off("error", Y),
                this.off("end", X),
                this.off(bJ, W),
                this.pause(),
                G({ value: F, done: !!this[_b] }));
            },
            X = () => {
              (this.off("error", Y),
                this.off("data", J),
                this.off(bJ, W),
                B(),
                G({ done: !0, value: void 0 }));
            },
            W = () => Y(Error("stream destroyed"));
          return new Promise((F, C) => {
            ((Z = C),
              (G = F),
              this.once(bJ, W),
              this.once("error", Y),
              this.once("end", X),
              this.once("data", J));
          });
        },
        throw: B,
        return: B,
        [Symbol.asyncIterator]() {
          return this;
        },
      };
    }
    [Symbol.iterator]() {
      this[ow] = !1;
      let A = !1,
        B = () => {
          return (
            this.pause(),
            this.off(IQ0, B),
            this.off(bJ, B),
            this.off("end", B),
            (A = !0),
            { done: !0, value: void 0 }
          );
        },
        Q = () => {
          if (A) return B();
          let I = this.read();
          return I === null ? B() : { done: !1, value: I };
        };
      return (
        this.once("end", B),
        this.once(IQ0, B),
        this.once(bJ, B),
        {
          next: Q,
          throw: B,
          return: B,
          [Symbol.iterator]() {
            return this;
          },
        }
      );
    }
    destroy(A) {
      if (this[bJ]) {
        if (A) this.emit("error", A);
        else this.emit(bJ);
        return this;
      }
      ((this[bJ] = !0), (this[ow] = !0), (this[QC].length = 0), (this[IC] = 0));
      let B = this;
      if (typeof B.close === "function" && !this[kQ1]) B.close();
      if (A) this.emit("error", A);
      else this.emit(bJ);
      return this;
    }
    static get isStream() {
      return H9I;
    }
  };
});
import { posix as O9I, win32 as VQ0 } from "node:path";
import { fileURLToPath as R9I } from "node:url";
import {
  lstatSync as T9I,
  readdir as P9I,
  readdirSync as j9I,
  readlinkSync as S9I,
  realpathSync as y9I,
} from "fs";
import * as k9I from "node:fs";
import {
  lstat as x9I,
  readdir as v9I,
  readlink as b9I,
  realpath as f9I,
} from "node:fs/promises";
var _9I,
  UqA,
  bt2 = (A) =>
    !A || A === UqA || A === k9I
      ? UqA
      : { ...UqA, ...A, promises: { ...UqA.promises, ...(A.promises || {}) } },
  ft2,
  h9I = (A) => A.replace(/\//g, "\\").replace(ft2, "$1\\"),
  g9I,
  yL = 0,
  ht2 = 1,
  gt2 = 2,
  My = 4,
  ut2 = 6,
  mt2 = 8,
  Mt = 10,
  dt2 = 12,
  SL = 15,
  zqA,
  FQ0 = 16,
  kt2 = 32,
  wqA = 64,
  gR = 128,
  bQ1 = 256,
  hQ1 = 512,
  _t2,
  u9I = 1023,
  CQ0 = (A) =>
    A.isFile()
      ? mt2
      : A.isDirectory()
        ? My
        : A.isSymbolicLink()
          ? Mt
          : A.isCharacterDevice()
            ? gt2
            : A.isBlockDevice()
              ? ut2
              : A.isSocket()
                ? dt2
                : A.isFIFO()
                  ? ht2
                  : yL,
  xt2,
  $qA = (A) => {
    let B = xt2.get(A);
    if (B) return B;
    let Q = A.normalize("NFKD");
    return (xt2.set(A, Q), Q);
  },
  vt2,
  fQ1 = (A) => {
    let B = vt2.get(A);
    if (B) return B;
    let Q = $qA(A.toLowerCase());
    return (vt2.set(A, Q), Q);
  },
  KQ0,
  ct2,
  pt2,
  OE,
  gQ1,
  uQ1,
  DQ0,
  qqA,
  NqA,
  mQ1,
  MzG,
  lt2;
var it2 = T(() => {
  HFA();
  WQ0();
  ((_9I = y9I.native),
    (UqA = {
      lstatSync: T9I,
      readdir: P9I,
      readdirSync: j9I,
      readlinkSync: S9I,
      realpathSync: _9I,
      promises: { lstat: x9I, readdir: v9I, readlink: b9I, realpath: f9I },
    }),
    (ft2 = /^\\\\\?\\([a-z]:)\\?$/i),
    (g9I = /[\\\/]/),
    (zqA = ~SL),
    (_t2 = wqA | gR | hQ1),
    (xt2 = new Map()),
    (vt2 = new Map()));
  KQ0 = class KQ0 extends AO {
    constructor() {
      super({ max: 256 });
    }
  };
  ct2 = class ct2 extends AO {
    constructor(A = 16384) {
      super({ maxSize: A, sizeCalculation: (B) => B.length + 1 });
    }
  };
  pt2 = Symbol("PathScurry setAsCwd");
  OE = class OE {
    name;
    root;
    roots;
    parent;
    nocase;
    isCWD = !1;
    #A;
    #B;
    get dev() {
      return this.#B;
    }
    #Q;
    get mode() {
      return this.#Q;
    }
    #I;
    get nlink() {
      return this.#I;
    }
    #G;
    get uid() {
      return this.#G;
    }
    #X;
    get gid() {
      return this.#X;
    }
    #Z;
    get rdev() {
      return this.#Z;
    }
    #F;
    get blksize() {
      return this.#F;
    }
    #W;
    get ino() {
      return this.#W;
    }
    #C;
    get size() {
      return this.#C;
    }
    #J;
    get blocks() {
      return this.#J;
    }
    #z;
    get atimeMs() {
      return this.#z;
    }
    #U;
    get mtimeMs() {
      return this.#U;
    }
    #D;
    get ctimeMs() {
      return this.#D;
    }
    #K;
    get birthtimeMs() {
      return this.#K;
    }
    #L;
    get atime() {
      return this.#L;
    }
    #H;
    get mtime() {
      return this.#H;
    }
    #M;
    get ctime() {
      return this.#M;
    }
    #O;
    get birthtime() {
      return this.#O;
    }
    #$;
    #q;
    #N;
    #E;
    #j;
    #R;
    #Y;
    #k;
    #w;
    #S;
    get parentPath() {
      return (this.parent || this).fullpath();
    }
    get path() {
      return this.parentPath;
    }
    constructor(A, B = yL, Q, I, G, Z, Y) {
      if (
        ((this.name = A),
        (this.#$ = G ? fQ1(A) : $qA(A)),
        (this.#Y = B & u9I),
        (this.nocase = G),
        (this.roots = I),
        (this.root = Q || this),
        (this.#k = Z),
        (this.#N = Y.fullpath),
        (this.#j = Y.relative),
        (this.#R = Y.relativePosix),
        (this.parent = Y.parent),
        this.parent)
      )
        this.#A = this.parent.#A;
      else this.#A = bt2(Y.fs);
    }
    depth() {
      if (this.#q !== void 0) return this.#q;
      if (!this.parent) return (this.#q = 0);
      return (this.#q = this.parent.depth() + 1);
    }
    childrenCache() {
      return this.#k;
    }
    resolve(A) {
      if (!A) return this;
      let B = this.getRootString(A),
        I = A.substring(B.length).split(this.splitSep);
      return B ? this.getRoot(B).#_(I) : this.#_(I);
    }
    #_(A) {
      let B = this;
      for (let Q of A) B = B.child(Q);
      return B;
    }
    children() {
      let A = this.#k.get(this);
      if (A) return A;
      let B = Object.assign([], { provisional: 0 });
      return (this.#k.set(this, B), (this.#Y &= ~FQ0), B);
    }
    child(A, B) {
      if (A === "" || A === ".") return this;
      if (A === "..") return this.parent || this;
      let Q = this.children(),
        I = this.nocase ? fQ1(A) : $qA(A);
      for (let J of Q) if (J.#$ === I) return J;
      let G = this.parent ? this.sep : "",
        Z = this.#N ? this.#N + G + A : void 0,
        Y = this.newChild(A, yL, { ...B, parent: this, fullpath: Z });
      if (!this.canReaddir()) Y.#Y |= gR;
      return (Q.push(Y), Y);
    }
    relative() {
      if (this.isCWD) return "";
      if (this.#j !== void 0) return this.#j;
      let A = this.name,
        B = this.parent;
      if (!B) return (this.#j = this.name);
      let Q = B.relative();
      return Q + (!Q || !B.parent ? "" : this.sep) + A;
    }
    relativePosix() {
      if (this.sep === "/") return this.relative();
      if (this.isCWD) return "";
      if (this.#R !== void 0) return this.#R;
      let A = this.name,
        B = this.parent;
      if (!B) return (this.#R = this.fullpathPosix());
      let Q = B.relativePosix();
      return Q + (!Q || !B.parent ? "" : "/") + A;
    }
    fullpath() {
      if (this.#N !== void 0) return this.#N;
      let A = this.name,
        B = this.parent;
      if (!B) return (this.#N = this.name);
      let I = B.fullpath() + (!B.parent ? "" : this.sep) + A;
      return (this.#N = I);
    }
    fullpathPosix() {
      if (this.#E !== void 0) return this.#E;
      if (this.sep === "/") return (this.#E = this.fullpath());
      if (!this.parent) {
        let I = this.fullpath().replace(/\\/g, "/");
        if (/^[a-z]:\//i.test(I)) return (this.#E = `//?/${I}`);
        else return (this.#E = I);
      }
      let A = this.parent,
        B = A.fullpathPosix(),
        Q = B + (!B || !A.parent ? "" : "/") + this.name;
      return (this.#E = Q);
    }
    isUnknown() {
      return (this.#Y & SL) === yL;
    }
    isType(A) {
      return this[`is${A}`]();
    }
    getType() {
      return this.isUnknown()
        ? "Unknown"
        : this.isDirectory()
          ? "Directory"
          : this.isFile()
            ? "File"
            : this.isSymbolicLink()
              ? "SymbolicLink"
              : this.isFIFO()
                ? "FIFO"
                : this.isCharacterDevice()
                  ? "CharacterDevice"
                  : this.isBlockDevice()
                    ? "BlockDevice"
                    : this.isSocket()
                      ? "Socket"
                      : "Unknown";
    }
    isFile() {
      return (this.#Y & SL) === mt2;
    }
    isDirectory() {
      return (this.#Y & SL) === My;
    }
    isCharacterDevice() {
      return (this.#Y & SL) === gt2;
    }
    isBlockDevice() {
      return (this.#Y & SL) === ut2;
    }
    isFIFO() {
      return (this.#Y & SL) === ht2;
    }
    isSocket() {
      return (this.#Y & SL) === dt2;
    }
    isSymbolicLink() {
      return (this.#Y & Mt) === Mt;
    }
    lstatCached() {
      return this.#Y & kt2 ? this : void 0;
    }
    readlinkCached() {
      return this.#w;
    }
    realpathCached() {
      return this.#S;
    }
    readdirCached() {
      let A = this.children();
      return A.slice(0, A.provisional);
    }
    canReadlink() {
      if (this.#w) return !0;
      if (!this.parent) return !1;
      let A = this.#Y & SL;
      return !((A !== yL && A !== Mt) || this.#Y & bQ1 || this.#Y & gR);
    }
    calledReaddir() {
      return !!(this.#Y & FQ0);
    }
    isENOENT() {
      return !!(this.#Y & gR);
    }
    isNamed(A) {
      return !this.nocase ? this.#$ === $qA(A) : this.#$ === fQ1(A);
    }
    async readlink() {
      let A = this.#w;
      if (A) return A;
      if (!this.canReadlink()) return;
      if (!this.parent) return;
      try {
        let B = await this.#A.promises.readlink(this.fullpath()),
          Q = (await this.parent.realpath())?.resolve(B);
        if (Q) return (this.#w = Q);
      } catch (B) {
        this.#V(B.code);
        return;
      }
    }
    readlinkSync() {
      let A = this.#w;
      if (A) return A;
      if (!this.canReadlink()) return;
      if (!this.parent) return;
      try {
        let B = this.#A.readlinkSync(this.fullpath()),
          Q = this.parent.realpathSync()?.resolve(B);
        if (Q) return (this.#w = Q);
      } catch (B) {
        this.#V(B.code);
        return;
      }
    }
    #x(A) {
      this.#Y |= FQ0;
      for (let B = A.provisional; B < A.length; B++) {
        let Q = A[B];
        if (Q) Q.#v();
      }
    }
    #v() {
      if (this.#Y & gR) return;
      ((this.#Y = (this.#Y | gR) & zqA), this.#T());
    }
    #T() {
      let A = this.children();
      A.provisional = 0;
      for (let B of A) B.#v();
    }
    #P() {
      ((this.#Y |= hQ1), this.#b());
    }
    #b() {
      if (this.#Y & wqA) return;
      let A = this.#Y;
      if ((A & SL) === My) A &= zqA;
      ((this.#Y = A | wqA), this.#T());
    }
    #f(A = "") {
      if (A === "ENOTDIR" || A === "EPERM") this.#b();
      else if (A === "ENOENT") this.#v();
      else this.children().provisional = 0;
    }
    #h(A = "") {
      if (A === "ENOTDIR") this.parent.#b();
      else if (A === "ENOENT") this.#v();
    }
    #V(A = "") {
      let B = this.#Y;
      if (((B |= bQ1), A === "ENOENT")) B |= gR;
      if (A === "EINVAL" || A === "UNKNOWN") B &= zqA;
      if (((this.#Y = B), A === "ENOTDIR" && this.parent)) this.parent.#b();
    }
    #g(A, B) {
      return this.#y(A, B) || this.#u(A, B);
    }
    #u(A, B) {
      let Q = CQ0(A),
        I = this.newChild(A.name, Q, { parent: this }),
        G = I.#Y & SL;
      if (G !== My && G !== Mt && G !== yL) I.#Y |= wqA;
      return (B.unshift(I), B.provisional++, I);
    }
    #y(A, B) {
      for (let Q = B.provisional; Q < B.length; Q++) {
        let I = B[Q];
        if ((this.nocase ? fQ1(A.name) : $qA(A.name)) !== I.#$) continue;
        return this.#m(A, I, Q, B);
      }
    }
    #m(A, B, Q, I) {
      let G = B.name;
      if (((B.#Y = (B.#Y & zqA) | CQ0(A)), G !== A.name)) B.name = A.name;
      if (Q !== I.provisional) {
        if (Q === I.length - 1) I.pop();
        else I.splice(Q, 1);
        I.unshift(B);
      }
      return (I.provisional++, B);
    }
    async lstat() {
      if ((this.#Y & gR) === 0)
        try {
          return (this.#l(await this.#A.promises.lstat(this.fullpath())), this);
        } catch (A) {
          this.#h(A.code);
        }
    }
    lstatSync() {
      if ((this.#Y & gR) === 0)
        try {
          return (this.#l(this.#A.lstatSync(this.fullpath())), this);
        } catch (A) {
          this.#h(A.code);
        }
    }
    #l(A) {
      let {
        atime: B,
        atimeMs: Q,
        birthtime: I,
        birthtimeMs: G,
        blksize: Z,
        blocks: Y,
        ctime: J,
        ctimeMs: X,
        dev: W,
        gid: F,
        ino: C,
        mode: V,
        mtime: K,
        mtimeMs: D,
        nlink: E,
        rdev: H,
        size: w,
        uid: L,
      } = A;
      ((this.#L = B),
        (this.#z = Q),
        (this.#O = I),
        (this.#K = G),
        (this.#F = Z),
        (this.#J = Y),
        (this.#M = J),
        (this.#D = X),
        (this.#B = W),
        (this.#X = F),
        (this.#W = C),
        (this.#Q = V),
        (this.#H = K),
        (this.#U = D),
        (this.#I = E),
        (this.#Z = H),
        (this.#C = w),
        (this.#G = L));
      let N = CQ0(A);
      if (
        ((this.#Y = (this.#Y & zqA) | N | kt2),
        N !== yL && N !== My && N !== Mt)
      )
        this.#Y |= wqA;
    }
    #c = [];
    #p = !1;
    #i(A) {
      this.#p = !1;
      let B = this.#c.slice();
      ((this.#c.length = 0), B.forEach((Q) => Q(null, A)));
    }
    readdirCB(A, B = !1) {
      if (!this.canReaddir()) {
        if (B) A(null, []);
        else queueMicrotask(() => A(null, []));
        return;
      }
      let Q = this.children();
      if (this.calledReaddir()) {
        let G = Q.slice(0, Q.provisional);
        if (B) A(null, G);
        else queueMicrotask(() => A(null, G));
        return;
      }
      if ((this.#c.push(A), this.#p)) return;
      this.#p = !0;
      let I = this.fullpath();
      this.#A.readdir(I, { withFileTypes: !0 }, (G, Z) => {
        if (G) (this.#f(G.code), (Q.provisional = 0));
        else {
          for (let Y of Z) this.#g(Y, Q);
          this.#x(Q);
        }
        this.#i(Q.slice(0, Q.provisional));
        return;
      });
    }
    #d;
    async readdir() {
      if (!this.canReaddir()) return [];
      let A = this.children();
      if (this.calledReaddir()) return A.slice(0, A.provisional);
      let B = this.fullpath();
      if (this.#d) await this.#d;
      else {
        let Q = () => {};
        this.#d = new Promise((I) => (Q = I));
        try {
          for (let I of await this.#A.promises.readdir(B, {
            withFileTypes: !0,
          }))
            this.#g(I, A);
          this.#x(A);
        } catch (I) {
          (this.#f(I.code), (A.provisional = 0));
        }
        ((this.#d = void 0), Q());
      }
      return A.slice(0, A.provisional);
    }
    readdirSync() {
      if (!this.canReaddir()) return [];
      let A = this.children();
      if (this.calledReaddir()) return A.slice(0, A.provisional);
      let B = this.fullpath();
      try {
        for (let Q of this.#A.readdirSync(B, { withFileTypes: !0 }))
          this.#g(Q, A);
        this.#x(A);
      } catch (Q) {
        (this.#f(Q.code), (A.provisional = 0));
      }
      return A.slice(0, A.provisional);
    }
    canReaddir() {
      if (this.#Y & _t2) return !1;
      let A = SL & this.#Y;
      if (!(A === yL || A === My || A === Mt)) return !1;
      return !0;
    }
    shouldWalk(A, B) {
      return (
        (this.#Y & My) === My &&
        !(this.#Y & _t2) &&
        !A.has(this) &&
        (!B || B(this))
      );
    }
    async realpath() {
      if (this.#S) return this.#S;
      if ((hQ1 | bQ1 | gR) & this.#Y) return;
      try {
        let A = await this.#A.promises.realpath(this.fullpath());
        return (this.#S = this.resolve(A));
      } catch (A) {
        this.#P();
      }
    }
    realpathSync() {
      if (this.#S) return this.#S;
      if ((hQ1 | bQ1 | gR) & this.#Y) return;
      try {
        let A = this.#A.realpathSync(this.fullpath());
        return (this.#S = this.resolve(A));
      } catch (A) {
        this.#P();
      }
    }
    [pt2](A) {
      if (A === this) return;
      ((A.isCWD = !1), (this.isCWD = !0));
      let B = new Set([]),
        Q = [],
        I = this;
      while (I && I.parent)
        (B.add(I),
          (I.#j = Q.join(this.sep)),
          (I.#R = Q.join("/")),
          (I = I.parent),
          Q.push(".."));
      I = A;
      while (I && I.parent && !B.has(I))
        ((I.#j = void 0), (I.#R = void 0), (I = I.parent));
    }
  };
  gQ1 = class gQ1 extends OE {
    sep = "\\";
    splitSep = g9I;
    constructor(A, B = yL, Q, I, G, Z, Y) {
      super(A, B, Q, I, G, Z, Y);
    }
    newChild(A, B = yL, Q = {}) {
      return new gQ1(
        A,
        B,
        this.root,
        this.roots,
        this.nocase,
        this.childrenCache(),
        Q,
      );
    }
    getRootString(A) {
      return VQ0.parse(A).root;
    }
    getRoot(A) {
      if (((A = h9I(A.toUpperCase())), A === this.root.name)) return this.root;
      for (let [B, Q] of Object.entries(this.roots))
        if (this.sameRoot(A, B)) return (this.roots[A] = Q);
      return (this.roots[A] = new qqA(A, this).root);
    }
    sameRoot(A, B = this.root.name) {
      return (
        (A = A.toUpperCase().replace(/\//g, "\\").replace(ft2, "$1\\")),
        A === B
      );
    }
  };
  uQ1 = class uQ1 extends OE {
    splitSep = "/";
    sep = "/";
    constructor(A, B = yL, Q, I, G, Z, Y) {
      super(A, B, Q, I, G, Z, Y);
    }
    getRootString(A) {
      return A.startsWith("/") ? "/" : "";
    }
    getRoot(A) {
      return this.root;
    }
    newChild(A, B = yL, Q = {}) {
      return new uQ1(
        A,
        B,
        this.root,
        this.roots,
        this.nocase,
        this.childrenCache(),
        Q,
      );
    }
  };
  DQ0 = class DQ0 {
    root;
    rootPath;
    roots;
    cwd;
    #A;
    #B;
    #Q;
    nocase;
    #I;
    constructor(
      A = process.cwd(),
      B,
      Q,
      { nocase: I, childrenCacheSize: G = 16384, fs: Z = UqA } = {},
    ) {
      if (((this.#I = bt2(Z)), A instanceof URL || A.startsWith("file://")))
        A = R9I(A);
      let Y = B.resolve(A);
      ((this.roots = Object.create(null)),
        (this.rootPath = this.parseRootPath(Y)),
        (this.#A = new KQ0()),
        (this.#B = new KQ0()),
        (this.#Q = new ct2(G)));
      let J = Y.substring(this.rootPath.length).split(Q);
      if (J.length === 1 && !J[0]) J.pop();
      if (I === void 0)
        throw TypeError("must provide nocase setting to PathScurryBase ctor");
      ((this.nocase = I),
        (this.root = this.newRoot(this.#I)),
        (this.roots[this.rootPath] = this.root));
      let X = this.root,
        W = J.length - 1,
        F = B.sep,
        C = this.rootPath,
        V = !1;
      for (let K of J) {
        let D = W--;
        ((X = X.child(K, {
          relative: Array(D).fill("..").join(F),
          relativePosix: Array(D).fill("..").join("/"),
          fullpath: (C += (V ? "" : F) + K),
        })),
          (V = !0));
      }
      this.cwd = X;
    }
    depth(A = this.cwd) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      return A.depth();
    }
    childrenCache() {
      return this.#Q;
    }
    resolve(...A) {
      let B = "";
      for (let G = A.length - 1; G >= 0; G--) {
        let Z = A[G];
        if (!Z || Z === ".") continue;
        if (((B = B ? `${Z}/${B}` : Z), this.isAbsolute(Z))) break;
      }
      let Q = this.#A.get(B);
      if (Q !== void 0) return Q;
      let I = this.cwd.resolve(B).fullpath();
      return (this.#A.set(B, I), I);
    }
    resolvePosix(...A) {
      let B = "";
      for (let G = A.length - 1; G >= 0; G--) {
        let Z = A[G];
        if (!Z || Z === ".") continue;
        if (((B = B ? `${Z}/${B}` : Z), this.isAbsolute(Z))) break;
      }
      let Q = this.#B.get(B);
      if (Q !== void 0) return Q;
      let I = this.cwd.resolve(B).fullpathPosix();
      return (this.#B.set(B, I), I);
    }
    relative(A = this.cwd) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      return A.relative();
    }
    relativePosix(A = this.cwd) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      return A.relativePosix();
    }
    basename(A = this.cwd) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      return A.name;
    }
    dirname(A = this.cwd) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      return (A.parent || A).fullpath();
    }
    async readdir(A = this.cwd, B = { withFileTypes: !0 }) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A), (A = this.cwd));
      let { withFileTypes: Q } = B;
      if (!A.canReaddir()) return [];
      else {
        let I = await A.readdir();
        return Q ? I : I.map((G) => G.name);
      }
    }
    readdirSync(A = this.cwd, B = { withFileTypes: !0 }) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A), (A = this.cwd));
      let { withFileTypes: Q = !0 } = B;
      if (!A.canReaddir()) return [];
      else if (Q) return A.readdirSync();
      else return A.readdirSync().map((I) => I.name);
    }
    async lstat(A = this.cwd) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      return A.lstat();
    }
    lstatSync(A = this.cwd) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      return A.lstatSync();
    }
    async readlink(A = this.cwd, { withFileTypes: B } = { withFileTypes: !1 }) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A.withFileTypes), (A = this.cwd));
      let Q = await A.readlink();
      return B ? Q : Q?.fullpath();
    }
    readlinkSync(A = this.cwd, { withFileTypes: B } = { withFileTypes: !1 }) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A.withFileTypes), (A = this.cwd));
      let Q = A.readlinkSync();
      return B ? Q : Q?.fullpath();
    }
    async realpath(A = this.cwd, { withFileTypes: B } = { withFileTypes: !1 }) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A.withFileTypes), (A = this.cwd));
      let Q = await A.realpath();
      return B ? Q : Q?.fullpath();
    }
    realpathSync(A = this.cwd, { withFileTypes: B } = { withFileTypes: !1 }) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A.withFileTypes), (A = this.cwd));
      let Q = A.realpathSync();
      return B ? Q : Q?.fullpath();
    }
    async walk(A = this.cwd, B = {}) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A), (A = this.cwd));
      let {
          withFileTypes: Q = !0,
          follow: I = !1,
          filter: G,
          walkFilter: Z,
        } = B,
        Y = [];
      if (!G || G(A)) Y.push(Q ? A : A.fullpath());
      let J = new Set(),
        X = (F, C) => {
          (J.add(F),
            F.readdirCB((V, K) => {
              if (V) return C(V);
              let D = K.length;
              if (!D) return C();
              let E = () => {
                if (--D === 0) C();
              };
              for (let H of K) {
                if (!G || G(H)) Y.push(Q ? H : H.fullpath());
                if (I && H.isSymbolicLink())
                  H.realpath()
                    .then((w) => (w?.isUnknown() ? w.lstat() : w))
                    .then((w) => (w?.shouldWalk(J, Z) ? X(w, E) : E()));
                else if (H.shouldWalk(J, Z)) X(H, E);
                else E();
              }
            }, !0));
        },
        W = A;
      return new Promise((F, C) => {
        X(W, (V) => {
          if (V) return C(V);
          F(Y);
        });
      });
    }
    walkSync(A = this.cwd, B = {}) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A), (A = this.cwd));
      let {
          withFileTypes: Q = !0,
          follow: I = !1,
          filter: G,
          walkFilter: Z,
        } = B,
        Y = [];
      if (!G || G(A)) Y.push(Q ? A : A.fullpath());
      let J = new Set([A]);
      for (let X of J) {
        let W = X.readdirSync();
        for (let F of W) {
          if (!G || G(F)) Y.push(Q ? F : F.fullpath());
          let C = F;
          if (F.isSymbolicLink()) {
            if (!(I && (C = F.realpathSync()))) continue;
            if (C.isUnknown()) C.lstatSync();
          }
          if (C.shouldWalk(J, Z)) J.add(C);
        }
      }
      return Y;
    }
    [Symbol.asyncIterator]() {
      return this.iterate();
    }
    iterate(A = this.cwd, B = {}) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A), (A = this.cwd));
      return this.stream(A, B)[Symbol.asyncIterator]();
    }
    [Symbol.iterator]() {
      return this.iterateSync();
    }
    *iterateSync(A = this.cwd, B = {}) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A), (A = this.cwd));
      let {
        withFileTypes: Q = !0,
        follow: I = !1,
        filter: G,
        walkFilter: Z,
      } = B;
      if (!G || G(A)) yield Q ? A : A.fullpath();
      let Y = new Set([A]);
      for (let J of Y) {
        let X = J.readdirSync();
        for (let W of X) {
          if (!G || G(W)) yield Q ? W : W.fullpath();
          let F = W;
          if (W.isSymbolicLink()) {
            if (!(I && (F = W.realpathSync()))) continue;
            if (F.isUnknown()) F.lstatSync();
          }
          if (F.shouldWalk(Y, Z)) Y.add(F);
        }
      }
    }
    stream(A = this.cwd, B = {}) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A), (A = this.cwd));
      let {
          withFileTypes: Q = !0,
          follow: I = !1,
          filter: G,
          walkFilter: Z,
        } = B,
        Y = new Lt({ objectMode: !0 });
      if (!G || G(A)) Y.write(Q ? A : A.fullpath());
      let J = new Set(),
        X = [A],
        W = 0,
        F = () => {
          let C = !1;
          while (!C) {
            let V = X.shift();
            if (!V) {
              if (W === 0) Y.end();
              return;
            }
            (W++, J.add(V));
            let K = (E, H, w = !1) => {
                if (E) return Y.emit("error", E);
                if (I && !w) {
                  let L = [];
                  for (let N of H)
                    if (N.isSymbolicLink())
                      L.push(
                        N.realpath().then(($) =>
                          $?.isUnknown() ? $.lstat() : $,
                        ),
                      );
                  if (L.length) {
                    Promise.all(L).then(() => K(null, H, !0));
                    return;
                  }
                }
                for (let L of H)
                  if (L && (!G || G(L))) {
                    if (!Y.write(Q ? L : L.fullpath())) C = !0;
                  }
                W--;
                for (let L of H) {
                  let N = L.realpathCached() || L;
                  if (N.shouldWalk(J, Z)) X.push(N);
                }
                if (C && !Y.flowing) Y.once("drain", F);
                else if (!D) F();
              },
              D = !0;
            (V.readdirCB(K, !0), (D = !1));
          }
        };
      return (F(), Y);
    }
    streamSync(A = this.cwd, B = {}) {
      if (typeof A === "string") A = this.cwd.resolve(A);
      else if (!(A instanceof OE)) ((B = A), (A = this.cwd));
      let {
          withFileTypes: Q = !0,
          follow: I = !1,
          filter: G,
          walkFilter: Z,
        } = B,
        Y = new Lt({ objectMode: !0 }),
        J = new Set();
      if (!G || G(A)) Y.write(Q ? A : A.fullpath());
      let X = [A],
        W = 0,
        F = () => {
          let C = !1;
          while (!C) {
            let V = X.shift();
            if (!V) {
              if (W === 0) Y.end();
              return;
            }
            (W++, J.add(V));
            let K = V.readdirSync();
            for (let D of K)
              if (!G || G(D)) {
                if (!Y.write(Q ? D : D.fullpath())) C = !0;
              }
            W--;
            for (let D of K) {
              let E = D;
              if (D.isSymbolicLink()) {
                if (!(I && (E = D.realpathSync()))) continue;
                if (E.isUnknown()) E.lstatSync();
              }
              if (E.shouldWalk(J, Z)) X.push(E);
            }
          }
          if (C && !Y.flowing) Y.once("drain", F);
        };
      return (F(), Y);
    }
    chdir(A = this.cwd) {
      let B = this.cwd;
      ((this.cwd = typeof A === "string" ? this.cwd.resolve(A) : A),
        this.cwd[pt2](B));
    }
  };
  qqA = class qqA extends DQ0 {
    sep = "\\";
    constructor(A = process.cwd(), B = {}) {
      let { nocase: Q = !0 } = B;
      super(A, VQ0, "\\", { ...B, nocase: Q });
      this.nocase = Q;
      for (let I = this.cwd; I; I = I.parent) I.nocase = this.nocase;
    }
    parseRootPath(A) {
      return VQ0.parse(A).root.toUpperCase();
    }
    newRoot(A) {
      return new gQ1(
        this.rootPath,
        My,
        void 0,
        this.roots,
        this.nocase,
        this.childrenCache(),
        { fs: A },
      );
    }
    isAbsolute(A) {
      return (
        A.startsWith("/") || A.startsWith("\\") || /^[a-z]:(\/|\\)/i.test(A)
      );
    }
  };
  NqA = class NqA extends DQ0 {
    sep = "/";
    constructor(A = process.cwd(), B = {}) {
      let { nocase: Q = !1 } = B;
      super(A, O9I, "/", { ...B, nocase: Q });
      this.nocase = Q;
    }
    parseRootPath(A) {
      return "/";
    }
    newRoot(A) {
      return new uQ1(
        this.rootPath,
        My,
        void 0,
        this.roots,
        this.nocase,
        this.childrenCache(),
        { fs: A },
      );
    }
    isAbsolute(A) {
      return A.startsWith("/");
    }
  };
  mQ1 = class mQ1 extends NqA {
    constructor(A = process.cwd(), B = {}) {
      let { nocase: Q = !0 } = B;
      super(A, { ...B, nocase: Q });
    }
  };
  ((MzG = process.platform === "win32" ? gQ1 : uQ1),
    (lt2 =
      process.platform === "win32"
        ? qqA
        : process.platform === "darwin"
          ? mQ1
          : NqA));
});
class c7A {
  #A;
  #B;
  #Q;
  length;
  #I;
  #G;
  #X;
  #Z;
  #F;
  #W;
  #C = !0;
  constructor(A, B, Q, I) {
    if (!m9I(A)) throw TypeError("empty pattern list");
    if (!d9I(B)) throw TypeError("empty glob list");
    if (B.length !== A.length)
      throw TypeError("mismatched pattern list and glob list lengths");
    if (((this.length = A.length), Q < 0 || Q >= this.length))
      throw TypeError("index out of range");
    if (
      ((this.#A = A),
      (this.#B = B),
      (this.#Q = Q),
      (this.#I = I),
      this.#Q === 0)
    ) {
      if (this.isUNC()) {
        let [G, Z, Y, J, ...X] = this.#A,
          [W, F, C, V, ...K] = this.#B;
        if (X[0] === "") (X.shift(), K.shift());
        let D = [G, Z, Y, J, ""].join("/"),
          E = [W, F, C, V, ""].join("/");
        ((this.#A = [D, ...X]),
          (this.#B = [E, ...K]),
          (this.length = this.#A.length));
      } else if (this.isDrive() || this.isAbsolute()) {
        let [G, ...Z] = this.#A,
          [Y, ...J] = this.#B;
        if (Z[0] === "") (Z.shift(), J.shift());
        let X = G + "/",
          W = Y + "/";
        ((this.#A = [X, ...Z]),
          (this.#B = [W, ...J]),
          (this.length = this.#A.length));
      }
    }
  }
  pattern() {
    return this.#A[this.#Q];
  }
  isString() {
    return typeof this.#A[this.#Q] === "string";
  }
  isGlobstar() {
    return this.#A[this.#Q] === SV;
  }
  isRegExp() {
    return this.#A[this.#Q] instanceof RegExp;
  }
  globString() {
    return (this.#X =
      this.#X ||
      (this.#Q === 0
        ? this.isAbsolute()
          ? this.#B[0] + this.#B.slice(1).join("/")
          : this.#B.join("/")
        : this.#B.slice(this.#Q).join("/")));
  }
  hasMore() {
    return this.length > this.#Q + 1;
  }
  rest() {
    if (this.#G !== void 0) return this.#G;
    if (!this.hasMore()) return (this.#G = null);
    return (
      (this.#G = new c7A(this.#A, this.#B, this.#Q + 1, this.#I)),
      (this.#G.#W = this.#W),
      (this.#G.#F = this.#F),
      (this.#G.#Z = this.#Z),
      this.#G
    );
  }
  isUNC() {
    let A = this.#A;
    return this.#F !== void 0
      ? this.#F
      : (this.#F =
          this.#I === "win32" &&
          this.#Q === 0 &&
          A[0] === "" &&
          A[1] === "" &&
          typeof A[2] === "string" &&
          !!A[2] &&
          typeof A[3] === "string" &&
          !!A[3]);
  }
  isDrive() {
    let A = this.#A;
    return this.#Z !== void 0
      ? this.#Z
      : (this.#Z =
          this.#I === "win32" &&
          this.#Q === 0 &&
          this.length > 1 &&
          typeof A[0] === "string" &&
          /^[a-z]:$/i.test(A[0]));
  }
  isAbsolute() {
    let A = this.#A;
    return this.#W !== void 0
      ? this.#W
      : (this.#W =
          (A[0] === "" && A.length > 1) || this.isDrive() || this.isUNC());
  }
  root() {
    let A = this.#A[0];
    return typeof A === "string" && this.isAbsolute() && this.#Q === 0 ? A : "";
  }
  checkFollowGlobstar() {
    return !(this.#Q === 0 || !this.isGlobstar() || !this.#C);
  }
  markFollowGlobstar() {
    if (this.#Q === 0 || !this.isGlobstar() || !this.#C) return !1;
    return ((this.#C = !1), !0);
  }
}
var m9I = (A) => A.length >= 1,
  d9I = (A) => A.length >= 1;
var EQ0 = T(() => {
  Cp();
});
class LqA {
  relative;
  relativeChildren;
  absolute;
  absoluteChildren;
  platform;
  mmopts;
  constructor(
    A,
    { nobrace: B, nocase: Q, noext: I, noglobstar: G, platform: Z = c9I },
  ) {
    ((this.relative = []),
      (this.absolute = []),
      (this.relativeChildren = []),
      (this.absoluteChildren = []),
      (this.platform = Z),
      (this.mmopts = {
        dot: !0,
        nobrace: B,
        nocase: Q,
        noext: I,
        noglobstar: G,
        optimizationLevel: 2,
        platform: Z,
        nocomment: !0,
        nonegate: !0,
      }));
    for (let Y of A) this.add(Y);
  }
  add(A) {
    let B = new jL(A, this.mmopts);
    for (let Q = 0; Q < B.set.length; Q++) {
      let I = B.set[Q],
        G = B.globParts[Q];
      if (!I || !G) throw Error("invalid pattern object");
      while (I[0] === "." && G[0] === ".") (I.shift(), G.shift());
      let Z = new c7A(I, G, 0, this.platform),
        Y = new jL(Z.globString(), this.mmopts),
        J = G[G.length - 1] === "**",
        X = Z.isAbsolute();
      if (X) this.absolute.push(Y);
      else this.relative.push(Y);
      if (J)
        if (X) this.absoluteChildren.push(Y);
        else this.relativeChildren.push(Y);
    }
  }
  ignored(A) {
    let B = A.fullpath(),
      Q = `${B}/`,
      I = A.relative() || ".",
      G = `${I}/`;
    for (let Z of this.relative) if (Z.match(I) || Z.match(G)) return !0;
    for (let Z of this.absolute) if (Z.match(B) || Z.match(Q)) return !0;
    return !1;
  }
  childrenIgnored(A) {
    let B = A.fullpath() + "/",
      Q = (A.relative() || ".") + "/";
    for (let I of this.relativeChildren) if (I.match(Q)) return !0;
    for (let I of this.absoluteChildren) if (I.match(B)) return !0;
    return !1;
  }
}
var c9I;
var HQ0 = T(() => {
  Cp();
  EQ0();
  c9I =
    typeof process === "object" &&
    process &&
    typeof process.platform === "string"
      ? process.platform
      : "linux";
});
class zQ0 {
  store;
  constructor(A = new Map()) {
    this.store = A;
  }
  copy() {
    return new zQ0(new Map(this.store));
  }
  hasWalked(A, B) {
    return this.store.get(A.fullpath())?.has(B.globString());
  }
  storeWalked(A, B) {
    let Q = A.fullpath(),
      I = this.store.get(Q);
    if (I) I.add(B.globString());
    else this.store.set(Q, new Set([B.globString()]));
  }
}
class nt2 {
  store = new Map();
  add(A, B, Q) {
    let I = (B ? 2 : 0) | (Q ? 1 : 0),
      G = this.store.get(A);
    this.store.set(A, G === void 0 ? I : I & G);
  }
  entries() {
    return [...this.store.entries()].map(([A, B]) => [A, !!(B & 2), !!(B & 1)]);
  }
}
class at2 {
  store = new Map();
  add(A, B) {
    if (!A.canReaddir()) return;
    let Q = this.store.get(A);
    if (Q) {
      if (!Q.find((I) => I.globString() === B.globString())) Q.push(B);
    } else this.store.set(A, [B]);
  }
  get(A) {
    let B = this.store.get(A);
    if (!B) throw Error("attempting to walk unknown path");
    return B;
  }
  entries() {
    return this.keys().map((A) => [A, this.store.get(A)]);
  }
  keys() {
    return [...this.store.keys()].filter((A) => A.canReaddir());
  }
}
class MqA {
  hasWalkedCache;
  matches = new nt2();
  subwalks = new at2();
  patterns;
  follow;
  dot;
  opts;
  constructor(A, B) {
    ((this.opts = A),
      (this.follow = !!A.follow),
      (this.dot = !!A.dot),
      (this.hasWalkedCache = B ? B.copy() : new zQ0()));
  }
  processPatterns(A, B) {
    this.patterns = B;
    let Q = B.map((I) => [A, I]);
    for (let [I, G] of Q) {
      this.hasWalkedCache.storeWalked(I, G);
      let Z = G.root(),
        Y = G.isAbsolute() && this.opts.absolute !== !1;
      if (Z) {
        I = I.resolve(
          Z === "/" && this.opts.root !== void 0 ? this.opts.root : Z,
        );
        let F = G.rest();
        if (!F) {
          this.matches.add(I, !0, !1);
          continue;
        } else G = F;
      }
      if (I.isENOENT()) continue;
      let J,
        X,
        W = !1;
      while (typeof (J = G.pattern()) === "string" && (X = G.rest()))
        ((I = I.resolve(J)), (G = X), (W = !0));
      if (((J = G.pattern()), (X = G.rest()), W)) {
        if (this.hasWalkedCache.hasWalked(I, G)) continue;
        this.hasWalkedCache.storeWalked(I, G);
      }
      if (typeof J === "string") {
        let F = J === ".." || J === "" || J === ".";
        this.matches.add(I.resolve(J), Y, F);
        continue;
      } else if (J === SV) {
        if (!I.isSymbolicLink() || this.follow || G.checkFollowGlobstar())
          this.subwalks.add(I, G);
        let F = X?.pattern(),
          C = X?.rest();
        if (!X || ((F === "" || F === ".") && !C))
          this.matches.add(I, Y, F === "" || F === ".");
        else if (F === "..") {
          let V = I.parent || I;
          if (!C) this.matches.add(V, Y, !0);
          else if (!this.hasWalkedCache.hasWalked(V, C))
            this.subwalks.add(V, C);
        }
      } else if (J instanceof RegExp) this.subwalks.add(I, G);
    }
    return this;
  }
  subwalkTargets() {
    return this.subwalks.keys();
  }
  child() {
    return new MqA(this.opts, this.hasWalkedCache);
  }
  filterEntries(A, B) {
    let Q = this.subwalks.get(A),
      I = this.child();
    for (let G of B)
      for (let Z of Q) {
        let Y = Z.isAbsolute(),
          J = Z.pattern(),
          X = Z.rest();
        if (J === SV) I.testGlobstar(G, Z, X, Y);
        else if (J instanceof RegExp) I.testRegExp(G, J, X, Y);
        else I.testString(G, J, X, Y);
      }
    return I;
  }
  testGlobstar(A, B, Q, I) {
    if (this.dot || !A.name.startsWith(".")) {
      if (!B.hasMore()) this.matches.add(A, I, !1);
      if (A.canReaddir()) {
        if (this.follow || !A.isSymbolicLink()) this.subwalks.add(A, B);
        else if (A.isSymbolicLink()) {
          if (Q && B.checkFollowGlobstar()) this.subwalks.add(A, Q);
          else if (B.markFollowGlobstar()) this.subwalks.add(A, B);
        }
      }
    }
    if (Q) {
      let G = Q.pattern();
      if (typeof G === "string" && G !== ".." && G !== "" && G !== ".")
        this.testString(A, G, Q.rest(), I);
      else if (G === "..") {
        let Z = A.parent || A;
        this.subwalks.add(Z, Q);
      } else if (G instanceof RegExp) this.testRegExp(A, G, Q.rest(), I);
    }
  }
  testRegExp(A, B, Q, I) {
    if (!B.test(A.name)) return;
    if (!Q) this.matches.add(A, I, !1);
    else this.subwalks.add(A, Q);
  }
  testString(A, B, Q, I) {
    if (!A.isNamed(B)) return;
    if (!Q) this.matches.add(A, I, !1);
    else this.subwalks.add(A, Q);
  }
}
var st2 = T(() => {
  Cp();
});
class UQ0 {
  path;
  patterns;
  opts;
  seen = new Set();
  paused = !1;
  aborted = !1;
  #A = [];
  #B;
  #Q;
  signal;
  maxDepth;
  includeChildMatches;
  constructor(A, B, Q) {
    if (
      ((this.patterns = A),
      (this.path = B),
      (this.opts = Q),
      (this.#Q = !Q.posix && Q.platform === "win32" ? "\\" : "/"),
      (this.includeChildMatches = Q.includeChildMatches !== !1),
      Q.ignore || !this.includeChildMatches)
    ) {
      if (
        ((this.#B = p9I(Q.ignore ?? [], Q)),
        !this.includeChildMatches && typeof this.#B.add !== "function")
      )
        throw Error("cannot ignore child matches, ignore lacks add() method.");
    }
    if (((this.maxDepth = Q.maxDepth || 1 / 0), Q.signal))
      ((this.signal = Q.signal),
        this.signal.addEventListener("abort", () => {
          this.#A.length = 0;
        }));
  }
  #I(A) {
    return this.seen.has(A) || !!this.#B?.ignored?.(A);
  }
  #G(A) {
    return !!this.#B?.childrenIgnored?.(A);
  }
  pause() {
    this.paused = !0;
  }
  resume() {
    if (this.signal?.aborted) return;
    this.paused = !1;
    let A = void 0;
    while (!this.paused && (A = this.#A.shift())) A();
  }
  onResume(A) {
    if (this.signal?.aborted) return;
    if (!this.paused) A();
    else this.#A.push(A);
  }
  async matchCheck(A, B) {
    if (B && this.opts.nodir) return;
    let Q;
    if (this.opts.realpath) {
      if (((Q = A.realpathCached() || (await A.realpath())), !Q)) return;
      A = Q;
    }
    let G = A.isUnknown() || this.opts.stat ? await A.lstat() : A;
    if (this.opts.follow && this.opts.nodir && G?.isSymbolicLink()) {
      let Z = await G.realpath();
      if (Z && (Z.isUnknown() || this.opts.stat)) await Z.lstat();
    }
    return this.matchCheckTest(G, B);
  }
  matchCheckTest(A, B) {
    return A &&
      (this.maxDepth === 1 / 0 || A.depth() <= this.maxDepth) &&
      (!B || A.canReaddir()) &&
      (!this.opts.nodir || !A.isDirectory()) &&
      (!this.opts.nodir ||
        !this.opts.follow ||
        !A.isSymbolicLink() ||
        !A.realpathCached()?.isDirectory()) &&
      !this.#I(A)
      ? A
      : void 0;
  }
  matchCheckSync(A, B) {
    if (B && this.opts.nodir) return;
    let Q;
    if (this.opts.realpath) {
      if (((Q = A.realpathCached() || A.realpathSync()), !Q)) return;
      A = Q;
    }
    let G = A.isUnknown() || this.opts.stat ? A.lstatSync() : A;
    if (this.opts.follow && this.opts.nodir && G?.isSymbolicLink()) {
      let Z = G.realpathSync();
      if (Z && (Z?.isUnknown() || this.opts.stat)) Z.lstatSync();
    }
    return this.matchCheckTest(G, B);
  }
  matchFinish(A, B) {
    if (this.#I(A)) return;
    if (!this.includeChildMatches && this.#B?.add) {
      let G = `${A.relativePosix()}/**`;
      this.#B.add(G);
    }
    let Q = this.opts.absolute === void 0 ? B : this.opts.absolute;
    this.seen.add(A);
    let I = this.opts.mark && A.isDirectory() ? this.#Q : "";
    if (this.opts.withFileTypes) this.matchEmit(A);
    else if (Q) {
      let G = this.opts.posix ? A.fullpathPosix() : A.fullpath();
      this.matchEmit(G + I);
    } else {
      let G = this.opts.posix ? A.relativePosix() : A.relative(),
        Z =
          this.opts.dotRelative && !G.startsWith(".." + this.#Q)
            ? "." + this.#Q
            : "";
      this.matchEmit(!G ? "." + I : Z + G + I);
    }
  }
  async match(A, B, Q) {
    let I = await this.matchCheck(A, Q);
    if (I) this.matchFinish(I, B);
  }
  matchSync(A, B, Q) {
    let I = this.matchCheckSync(A, Q);
    if (I) this.matchFinish(I, B);
  }
  walkCB(A, B, Q) {
    if (this.signal?.aborted) Q();
    this.walkCB2(A, B, new MqA(this.opts), Q);
  }
  walkCB2(A, B, Q, I) {
    if (this.#G(A)) return I();
    if (this.signal?.aborted) I();
    if (this.paused) {
      this.onResume(() => this.walkCB2(A, B, Q, I));
      return;
    }
    Q.processPatterns(A, B);
    let G = 1,
      Z = () => {
        if (--G === 0) I();
      };
    for (let [Y, J, X] of Q.matches.entries()) {
      if (this.#I(Y)) continue;
      (G++, this.match(Y, J, X).then(() => Z()));
    }
    for (let Y of Q.subwalkTargets()) {
      if (this.maxDepth !== 1 / 0 && Y.depth() >= this.maxDepth) continue;
      G++;
      let J = Y.readdirCached();
      if (Y.calledReaddir()) this.walkCB3(Y, J, Q, Z);
      else Y.readdirCB((X, W) => this.walkCB3(Y, W, Q, Z), !0);
    }
    Z();
  }
  walkCB3(A, B, Q, I) {
    Q = Q.filterEntries(A, B);
    let G = 1,
      Z = () => {
        if (--G === 0) I();
      };
    for (let [Y, J, X] of Q.matches.entries()) {
      if (this.#I(Y)) continue;
      (G++, this.match(Y, J, X).then(() => Z()));
    }
    for (let [Y, J] of Q.subwalks.entries())
      (G++, this.walkCB2(Y, J, Q.child(), Z));
    Z();
  }
  walkCBSync(A, B, Q) {
    if (this.signal?.aborted) Q();
    this.walkCB2Sync(A, B, new MqA(this.opts), Q);
  }
  walkCB2Sync(A, B, Q, I) {
    if (this.#G(A)) return I();
    if (this.signal?.aborted) I();
    if (this.paused) {
      this.onResume(() => this.walkCB2Sync(A, B, Q, I));
      return;
    }
    Q.processPatterns(A, B);
    let G = 1,
      Z = () => {
        if (--G === 0) I();
      };
    for (let [Y, J, X] of Q.matches.entries()) {
      if (this.#I(Y)) continue;
      this.matchSync(Y, J, X);
    }
    for (let Y of Q.subwalkTargets()) {
      if (this.maxDepth !== 1 / 0 && Y.depth() >= this.maxDepth) continue;
      G++;
      let J = Y.readdirSync();
      this.walkCB3Sync(Y, J, Q, Z);
    }
    Z();
  }
  walkCB3Sync(A, B, Q, I) {
    Q = Q.filterEntries(A, B);
    let G = 1,
      Z = () => {
        if (--G === 0) I();
      };
    for (let [Y, J, X] of Q.matches.entries()) {
      if (this.#I(Y)) continue;
      this.matchSync(Y, J, X);
    }
    for (let [Y, J] of Q.subwalks.entries())
      (G++, this.walkCB2Sync(Y, J, Q.child(), Z));
    Z();
  }
}
var p9I = (A, B) =>
    typeof A === "string"
      ? new LqA([A], B)
      : Array.isArray(A)
        ? new LqA(A, B)
        : A,
  dQ1,
  cQ1;
var rt2 = T(() => {
  WQ0();
  HQ0();
  st2();
  dQ1 = class dQ1 extends UQ0 {
    matches = new Set();
    constructor(A, B, Q) {
      super(A, B, Q);
    }
    matchEmit(A) {
      this.matches.add(A);
    }
    async walk() {
      if (this.signal?.aborted) throw this.signal.reason;
      if (this.path.isUnknown()) await this.path.lstat();
      return (
        await new Promise((A, B) => {
          this.walkCB(this.path, this.patterns, () => {
            if (this.signal?.aborted) B(this.signal.reason);
            else A(this.matches);
          });
        }),
        this.matches
      );
    }
    walkSync() {
      if (this.signal?.aborted) throw this.signal.reason;
      if (this.path.isUnknown()) this.path.lstatSync();
      return (
        this.walkCBSync(this.path, this.patterns, () => {
          if (this.signal?.aborted) throw this.signal.reason;
        }),
        this.matches
      );
    }
  };
  cQ1 = class cQ1 extends UQ0 {
    results;
    constructor(A, B, Q) {
      super(A, B, Q);
      ((this.results = new Lt({ signal: this.signal, objectMode: !0 })),
        this.results.on("drain", () => this.resume()),
        this.results.on("resume", () => this.resume()));
    }
    matchEmit(A) {
      if ((this.results.write(A), !this.results.flowing)) this.pause();
    }
    stream() {
      let A = this.path;
      if (A.isUnknown())
        A.lstat().then(() => {
          this.walkCB(A, this.patterns, () => this.results.end());
        });
      else this.walkCB(A, this.patterns, () => this.results.end());
      return this.results;
    }
    streamSync() {
      if (this.path.isUnknown()) this.path.lstatSync();
      return (
        this.walkCBSync(this.path, this.patterns, () => this.results.end()),
        this.results
      );
    }
  };
});
import { fileURLToPath as l9I } from "node:url";
var i9I, Oy;
var wQ0 = T(() => {
  Cp();
  it2();
  EQ0();
  rt2();
  i9I =
    typeof process === "object" &&
    process &&
    typeof process.platform === "string"
      ? process.platform
      : "linux";
  Oy = class Oy {
    absolute;
    cwd;
    root;
    dot;
    dotRelative;
    follow;
    ignore;
    magicalBraces;
    mark;
    matchBase;
    maxDepth;
    nobrace;
    nocase;
    nodir;
    noext;
    noglobstar;
    pattern;
    platform;
    realpath;
    scurry;
    stat;
    signal;
    windowsPathsNoEscape;
    withFileTypes;
    includeChildMatches;
    opts;
    patterns;
    constructor(A, B) {
      if (!B) throw TypeError("glob options required");
      if (
        ((this.withFileTypes = !!B.withFileTypes),
        (this.signal = B.signal),
        (this.follow = !!B.follow),
        (this.dot = !!B.dot),
        (this.dotRelative = !!B.dotRelative),
        (this.nodir = !!B.nodir),
        (this.mark = !!B.mark),
        !B.cwd)
      )
        this.cwd = "";
      else if (B.cwd instanceof URL || B.cwd.startsWith("file://"))
        B.cwd = l9I(B.cwd);
      if (
        ((this.cwd = B.cwd || ""),
        (this.root = B.root),
        (this.magicalBraces = !!B.magicalBraces),
        (this.nobrace = !!B.nobrace),
        (this.noext = !!B.noext),
        (this.realpath = !!B.realpath),
        (this.absolute = B.absolute),
        (this.includeChildMatches = B.includeChildMatches !== !1),
        (this.noglobstar = !!B.noglobstar),
        (this.matchBase = !!B.matchBase),
        (this.maxDepth = typeof B.maxDepth === "number" ? B.maxDepth : 1 / 0),
        (this.stat = !!B.stat),
        (this.ignore = B.ignore),
        this.withFileTypes && this.absolute !== void 0)
      )
        throw Error("cannot set absolute and withFileTypes:true");
      if (typeof A === "string") A = [A];
      if (
        ((this.windowsPathsNoEscape =
          !!B.windowsPathsNoEscape || B.allowWindowsEscape === !1),
        this.windowsPathsNoEscape)
      )
        A = A.map((J) => J.replace(/\\/g, "/"));
      if (this.matchBase) {
        if (B.noglobstar) throw TypeError("base matching requires globstar");
        A = A.map((J) => (J.includes("/") ? J : `./**/${J}`));
      }
      if (
        ((this.pattern = A),
        (this.platform = B.platform || i9I),
        (this.opts = { ...B, platform: this.platform }),
        B.scurry)
      ) {
        if (
          ((this.scurry = B.scurry),
          B.nocase !== void 0 && B.nocase !== B.scurry.nocase)
        )
          throw Error("nocase option contradicts provided scurry option");
      } else {
        let J =
          B.platform === "win32"
            ? qqA
            : B.platform === "darwin"
              ? mQ1
              : B.platform
                ? NqA
                : lt2;
        this.scurry = new J(this.cwd, { nocase: B.nocase, fs: B.fs });
      }
      this.nocase = this.scurry.nocase;
      let Q = this.platform === "darwin" || this.platform === "win32",
        I = {
          ...B,
          dot: this.dot,
          matchBase: this.matchBase,
          nobrace: this.nobrace,
          nocase: this.nocase,
          nocaseMagicOnly: Q,
          nocomment: !0,
          noext: this.noext,
          nonegate: !0,
          optimizationLevel: 2,
          platform: this.platform,
          windowsPathsNoEscape: this.windowsPathsNoEscape,
          debug: !!this.opts.debug,
        },
        G = this.pattern.map((J) => new jL(J, I)),
        [Z, Y] = G.reduce(
          (J, X) => {
            return (J[0].push(...X.set), J[1].push(...X.globParts), J);
          },
          [[], []],
        );
      this.patterns = Z.map((J, X) => {
        let W = Y[X];
        if (!W) throw Error("invalid pattern object");
        return new c7A(J, W, 0, this.platform);
      });
    }
    async walk() {
      return [
        ...(await new dQ1(this.patterns, this.scurry.cwd, {
          ...this.opts,
          maxDepth:
            this.maxDepth !== 1 / 0
              ? this.maxDepth + this.scurry.cwd.depth()
              : 1 / 0,
          platform: this.platform,
          nocase: this.nocase,
          includeChildMatches: this.includeChildMatches,
        }).walk()),
      ];
    }
    walkSync() {
      return [
        ...new dQ1(this.patterns, this.scurry.cwd, {
          ...this.opts,
          maxDepth:
            this.maxDepth !== 1 / 0
              ? this.maxDepth + this.scurry.cwd.depth()
              : 1 / 0,
          platform: this.platform,
          nocase: this.nocase,
          includeChildMatches: this.includeChildMatches,
        }).walkSync(),
      ];
    }
    stream() {
      return new cQ1(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth:
          this.maxDepth !== 1 / 0
            ? this.maxDepth + this.scurry.cwd.depth()
            : 1 / 0,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches,
      }).stream();
    }
    streamSync() {
      return new cQ1(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth:
          this.maxDepth !== 1 / 0
            ? this.maxDepth + this.scurry.cwd.depth()
            : 1 / 0,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches,
      }).streamSync();
    }
    iterateSync() {
      return this.streamSync()[Symbol.iterator]();
    }
    [Symbol.iterator]() {
      return this.iterateSync();
    }
    iterate() {
      return this.stream()[Symbol.asyncIterator]();
    }
    [Symbol.asyncIterator]() {
      return this.iterate();
    }
  };
});
var $Q0 = (A, B = {}) => {
  if (!Array.isArray(A)) A = [A];
  for (let Q of A) if (new jL(Q, B).hasMagic()) return !0;
  return !1;
};
var qQ0 = T(() => {
  Cp();
});
function lQ1(A, B = {}) {
  return new Oy(A, B).streamSync();
}
function tt2(A, B = {}) {
  return new Oy(A, B).stream();
}
function et2(A, B = {}) {
  return new Oy(A, B).walkSync();
}
async function ot2(A, B = {}) {
  return new Oy(A, B).walk();
}
function iQ1(A, B = {}) {
  return new Oy(A, B).iterateSync();
}
function Ae2(A, B = {}) {
  return new Oy(A, B).iterate();
}
var n9I, a9I, s9I, r9I, o9I, pQ1;
var Be2 = T(() => {
  Cp();
  wQ0();
  qQ0();
  Cp();
  wQ0();
  qQ0();
  HQ0();
  ((n9I = lQ1),
    (a9I = Object.assign(tt2, { sync: lQ1 })),
    (s9I = iQ1),
    (r9I = Object.assign(Ae2, { sync: iQ1 })),
    (o9I = Object.assign(et2, { stream: lQ1, iterate: iQ1 })),
    (pQ1 = Object.assign(ot2, {
      glob: ot2,
      globSync: et2,
      sync: o9I,
      globStream: tt2,
      stream: a9I,
      globStreamSync: lQ1,
      streamSync: n9I,
      globIterate: Ae2,
      iterate: r9I,
      globIterateSync: iQ1,
      iterateSync: s9I,
      Glob: Oy,
      hasMagic: $Q0,
      escape: u7A,
      unescape: fR,
    })));
  pQ1.glob = pQ1;
});
class Qe2 {
  cache = new Map();
  maxCacheSize = 1000;
  readFile(A) {
    let B = NA(),
      Q;
    try {
      Q = B.statSync(A);
    } catch (J) {
      throw (this.cache.delete(A), J);
    }
    let I = A,
      G = this.cache.get(I);
    if (G && G.mtime === Q.mtimeMs)
      return { content: G.content, encoding: G.encoding };
    let Z = PK(A),
      Y = B.readFileSync(A, { encoding: Z }).replaceAll(
        `\r
`,
        `
`,
      );
    if (
      (this.cache.set(I, { content: Y, encoding: Z, mtime: Q.mtimeMs }),
      this.cache.size > this.maxCacheSize)
    ) {
      let J = this.cache.keys().next().value;
      if (J) this.cache.delete(J);
    }
    return { content: Y, encoding: Z };
  }
  clear() {
    this.cache.clear();
  }
  invalidate(A) {
    this.cache.delete(A);
  }
  getStats() {
    return { size: this.cache.size, entries: Array.from(this.cache.keys()) };
  }
}
var Ie2;
var Ge2 = T(() => {
  m0();
  Z4();
  Ie2 = new Qe2();
});
import {
  isAbsolute as MQ0,
  resolve as Ze2,
  relative as t9I,
  sep as e9I,
  basename as NQ0,
  dirname as Ye2,
  extname as LQ0,
  join as p7A,
} from "path";
import { homedir as A4I } from "os";
import { chmodSync as B4I } from "fs";
async function PMQ(A, B, { limit: Q, offset: I }, G, Z) {
  let Y = E6A(H6A(Z), B);
  if (xC("tengu_glob_with_rg")) {
    let F = [
      "--files",
      "--glob",
      A,
      "--sort=modified",
      "--no-ignore",
      "--hidden",
    ];
    for (let E of Y) F.push("--glob", `!${E}`);
    let V = (await FH(F, B, G)).map((E) => (MQ0(E) ? E : p7A(B, E))),
      K = V.length > I + Q;
    return { files: V.slice(I, I + Q), truncated: K };
  }
  let X = (
      await pQ1([A], {
        cwd: B,
        nocase: !0,
        nodir: !0,
        signal: G,
        stat: !0,
        withFileTypes: !0,
        ignore: Y,
      })
    ).sort((F, C) => (F.mtimeMs ?? 0) - (C.mtimeMs ?? 0)),
    W = X.length > I + Q;
  return { files: X.slice(I, I + Q).map((F) => F.fullpath()), truncated: W };
}
function BV(A) {
  let B = NA();
  return Math.ceil(B.statSync(A).mtimeMs);
}
function wqQ(A, B = 0, Q) {
  let Z = NA().readFileSync(A, { encoding: "utf8" }).split(/\r?\n/),
    Y = Q !== void 0 && Z.length - B > Q ? Z.slice(B, B + Q) : Z.slice(B);
  return {
    content: Y.join(`
`),
    lineCount: Y.length,
    totalLines: Z.length,
  };
}
function D6A(A, B, Q, I) {
  let G = B;
  if (I === "CRLF")
    G = B.split(`
`).join(`\r
`);
  fj(A, G, { encoding: Q });
}
function PK(A) {
  try {
    let Q = NA(),
      { resolvedPath: I } = KC(Q, A),
      { buffer: G, bytesRead: Z } = Q.readSync(I, { length: 4096 });
    if (Z >= 2) {
      if (G[0] === 255 && G[1] === 254) return "utf16le";
    }
    if (Z >= 3 && G[0] === 239 && G[1] === 187 && G[2] === 191) return "utf8";
    return G.slice(0, Z).toString("utf8").length > 0 ? "utf8" : "ascii";
  } catch (Q) {
    return (BA(Q, xZ0), "utf8");
  }
}
function _s(A, B = "utf8") {
  try {
    let Q = NA(),
      { resolvedPath: I } = KC(Q, A),
      { buffer: G, bytesRead: Z } = Q.readSync(I, { length: 4096 }),
      Y = G.toString(B, 0, Z);
    return Q4I(Y);
  } catch (Q) {
    return (BA(Q, vZ0), "LF");
  }
}
function Q4I(A) {
  let B = 0,
    Q = 0;
  for (let I = 0; I < A.length; I++)
    if (
      A[I] ===
      `
`
    )
      if (I > 0 && A[I - 1] === "\r") B++;
      else Q++;
  return B > Q ? "CRLF" : "LF";
}
function Hs(A) {
  let B = MQ0(A) ? A : Ze2(G0(), A),
    Q = NA(),
    I = String.fromCharCode(8239),
    G = /^(.+)([ \u202F])(AM|PM)(\.png)$/,
    Z = NQ0(B).match(G);
  if (Z) {
    if (Q.existsSync(B)) return B;
    let Y = Z[2],
      J = Y === " " ? I : " ",
      X = B.replace(`${Y}${Z[3]}${Z[4]}`, `${J}${Z[3]}${Z[4]}`);
    if (Q.existsSync(X)) return X;
  }
  return B;
}
function I6A(A) {
  return A.replace(/^\t+/gm, (B) => "  ".repeat(B.length));
}
function I4I(A) {
  let B = A ? M9(A) : void 0,
    Q = B ? t9I(G0(), B) : void 0;
  return { absolutePath: B, relativePath: Q };
}
function TY(A) {
  let { relativePath: B } = I4I(A);
  if (B && !B.startsWith("..")) return B;
  let Q = A4I();
  if (A.startsWith(Q + e9I)) return "~" + A.slice(Q.length);
  return A;
}
function KiA(A) {
  let B = NA();
  try {
    let Q = Ye2(A),
      I = NQ0(A, LQ0(A));
    if (!B.existsSync(Q)) return;
    let Y = B.readdirSync(Q).filter(
      (J) => NQ0(J.name, LQ0(J.name)) === I && p7A(Q, J.name) !== A,
    )[0];
    if (Y) return Y.name;
    return;
  } catch (Q) {
    BA(Q, gZ0);
    return;
  }
}
function Sm({ content: A, startLine: B }) {
  if (!A) return "";
  return A.split(/\r?\n/).map((I, G) => {
    let Z = G + B,
      Y = String(Z);
    if (Y.length >= 6) return `${Y}→${I}`;
    return `${Y.padStart(6, " ")}→${I}`;
  }).join(`
`);
}
function fx0(A) {
  let B = NA();
  if (!B.existsSync(A)) return !0;
  return B.isDirEmptySync(A);
}
function ww(A) {
  let B = NA(),
    { resolvedPath: Q, isSymlink: I } = KC(B, A);
  if (I) g(`Reading through symlink: ${A} -> ${Q}`);
  let G = PK(Q);
  return B.readFileSync(Q, { encoding: G }).replaceAll(
    `\r
`,
    `
`,
  );
}
function Dv1(A) {
  let { content: B } = Ie2.readFile(A);
  return B;
}
function fj(A, B, Q = { encoding: "utf-8" }) {
  let I = NA(),
    G = A;
  if (I.existsSync(A))
    try {
      let Y = I.readlinkSync(A);
      ((G = MQ0(Y) ? Y : Ze2(Ye2(A), Y)),
        g(`Writing through symlink: ${A} -> ${G}`));
    } catch (Y) {
      G = A;
    }
  let Z = `${G}.tmp.${process.pid}.${Date.now()}`;
  try {
    g(`Writing to temp file: ${Z}`);
    let Y,
      J = I.existsSync(G);
    if (J)
      ((Y = I.statSync(G).mode),
        g(`Preserving file permissions: ${Y.toString(8)}`));
    else if (Q.mode !== void 0)
      ((Y = Q.mode), g(`Setting permissions for new file: ${Y.toString(8)}`));
    let X = { encoding: Q.encoding, flush: !0 };
    if (!J && Q.mode !== void 0) X.mode = Q.mode;
    if (
      (I.writeFileSync(Z, B, X),
      g(`Temp file written successfully, size: ${B.length} bytes`),
      J && Y !== void 0)
    )
      (B4I(Z, Y), g("Applied original permissions to temp file"));
    (g(`Renaming ${Z} to ${G}`),
      I.renameSync(Z, G),
      g(`File ${G} written atomically`));
  } catch (Y) {
    (g(`Failed to write file atomically: ${Y}`),
      BA(Y, pZ0),
      GA("tengu_atomic_write_error", {}));
    try {
      if (I.existsSync(Z)) (g(`Cleaning up temp file: ${Z}`), I.unlinkSync(Z));
    } catch (J) {
      g(`Failed to clean up temp file: ${J}`);
    }
    g(`Falling back to non-atomic write for ${G}`);
    try {
      let J = { encoding: Q.encoding, flush: !0 };
      if (!I.existsSync(G) && Q.mode !== void 0) J.mode = Q.mode;
      (I.writeFileSync(G, B, J),
        g(`File ${G} written successfully with non-atomic fallback`));
    } catch (J) {
      throw (g(`Non-atomic write also failed: ${J}`), J);
    }
  }
}
function aQ1(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-");
}
function XF(A) {
  let B = A / 1024;
  if (B < 1) return `${A} bytes`;
  if (B < 1024) return `${B.toFixed(1).replace(/\.0$/, "")}KB`;
  let Q = B / 1024;
  if (Q < 1024) return `${Q.toFixed(1).replace(/\.0$/, "")}MB`;
  return `${(Q / 1024).toFixed(1).replace(/\.0$/, "")}GB`;
}
function YIA(A) {
  let B = LQ0(A);
  if (!B) return "unknown";
  return Je2.getLanguage(B.slice(1))?.name ?? "unknown";
}
function llA(A) {
  let B = NA();
  try {
    if (!B.existsSync(A)) B.mkdirSync(A);
    return !0;
  } catch (Q) {
    return (BA(Q instanceof Error ? Q : Error(String(Q)), hZ0), !1);
  }
}
function DiA(A, B = mDA) {
  try {
    return NA().statSync(A).size <= B;
  } catch {
    return !1;
  }
}
var Je2,
  mDA = 262144,
  DMQ,
  nQ1,
  Hy;
var Z4 = T(() => {
  c1();
  C0();
  vG();
  H0();
  f4();
  eo2();
  Be2();
  uT();
  V2();
  a2();
  m0();
  Ge2();
  KJ();
  E5();
  hG();
  Je2 = IA(VS1(), 1);
  DMQ = I0(async () => {
    let A = a9();
    setTimeout(() => {
      A.abort();
    }, 1000);
    let B = await iP0(G0(), A.signal, 15),
      Q = 0;
    for (let I of B) if (_s(I) === "CRLF") Q++;
    return Q > 3 ? "CRLF" : "LF";
  });
  nQ1 = oB0("claude-cli");
  Hy = {
    baseLogs: () => p7A(nQ1.cache, aQ1(NA().cwd())),
    errors: () => p7A(nQ1.cache, aQ1(NA().cwd()), "errors"),
    messages: () => p7A(nQ1.cache, aQ1(NA().cwd()), "messages"),
    mcpLogs: (A) => p7A(nQ1.cache, aQ1(NA().cwd()), `mcp-logs-${A}`),
  };
});
import { dirname as G4I, join as OQ0 } from "path";
function P$A(A, B) {
  return A.customTitle || A.summary || A.firstPrompt || B || "";
}
function Z4I(A) {
  return A.toISOString().replace(/[:.]/g, "-");
}
function Y4I() {
  return OQ0(Hy.errors(), RQ0 + ".txt");
}
function BA(A, B) {
  try {
    if (
      V0(process.env.CLAUDE_CODE_USE_BEDROCK) ||
      V0(process.env.CLAUDE_CODE_USE_VERTEX) ||
      process.env.DISABLE_ERROR_REPORTING ||
      process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
    )
      return;
    let Q = A.stack || A.message,
      I = { error: Q, timestamp: new Date().toISOString() };
    (g(`${A.name}: ${Q}`, { level: "error" }),
      T80(I),
      J4I(Y4I(), { error: Q }));
  } catch {}
}
function _4A() {
  return R80();
}
function TQ0(A) {
  if (!NA().existsSync(A)) return [];
  try {
    return JSON.parse(NA().readFileSync(A, { encoding: "utf8" }));
  } catch {
    return [];
  }
}
function J4I(A, B) {
  return;
}
function OG(A, B) {
  if (
    (g(`MCP server "${A}" ${B}`, { level: "error" }),
    (N0() || {}).cleanupPeriodDays === 0)
  )
    return;
  try {
    let I = Hy.mcpLogs(A),
      G = B instanceof Error ? B.stack || B.message : String(B),
      Z = new Date().toISOString(),
      Y = OQ0(I, RQ0 + ".txt");
    if (!NA().existsSync(I)) NA().mkdirSync(I);
    if (!NA().existsSync(Y))
      NA().writeFileSync(Y, "[]", { encoding: "utf8", flush: !1 });
    let J = { error: G, timestamp: Z, sessionId: L0(), cwd: NA().cwd() },
      X = TQ0(Y);
    (X.push(J),
      NA().writeFileSync(Y, JSON.stringify(X, null, 2), {
        encoding: "utf8",
        flush: !1,
      }));
  } catch {}
}
function P0(A, B) {
  g(`MCP server "${A}": ${B}`);
  try {
    let Q = Hy.mcpLogs(A),
      I = new Date().toISOString(),
      G = OQ0(Q, RQ0 + ".txt");
    if (!NA().existsSync(Q)) NA().mkdirSync(Q);
    if (!NA().existsSync(G))
      NA().writeFileSync(G, "[]", { encoding: "utf8", flush: !1 });
    let Z = { debug: B, timestamp: I, sessionId: L0(), cwd: NA().cwd() },
      Y = TQ0(G);
    (Y.push(Z),
      NA().writeFileSync(G, JSON.stringify(Y, null, 2), {
        encoding: "utf8",
        flush: !1,
      }));
  } catch {}
}
function XB0(A, B) {
  if (!B || B !== "repl_main_thread") return;
  let Q = structuredClone(A);
  O80(Q);
}
var RQ0;
var c1 = T(() => {
  i0();
  Z4();
  m0();
  OQ();
  vB();
  i0();
  C0();
  RQ0 = Z4I(new Date());
});
function X4I(A) {
  let B = A,
    Q = "",
    I = 0,
    G = 10;
  while (B !== Q && I < G)
    ((Q = B),
      (B = B.normalize("NFKC")),
      (B = B.replace(/[\p{Cf}\p{Co}\p{Cn}]/gu, "")),
      (B = B.replace(/[\u200B-\u200F]/g, "")
        .replace(/[\u202A-\u202E]/g, "")
        .replace(/[\u2066-\u2069]/g, "")
        .replace(/[\uFEFF]/g, "")
        .replace(/[\uE000-\uF8FF]/g, "")),
      I++);
  if (I >= G)
    throw Error(
      `Unicode sanitization reached maximum iterations (${G}) for input: ${A.slice(0, 100)}`,
    );
  return B;
}
function l7A(A) {
  if (typeof A === "string") return X4I(A);
  if (Array.isArray(A)) return A.map(l7A);
  if (A !== null && typeof A === "object") {
    let B = {};
    for (let [Q, I] of Object.entries(A)) B[l7A(Q)] = l7A(I);
    return B;
  }
  return A;
}
function PQ0() {
  return parseInt(process.env.MAX_MCP_OUTPUT_TOKENS ?? "25000", 10);
}
function C4I(A) {
  return A.type === "text";
}
function V4I(A) {
  return A.type === "image";
}
function jQ0(A) {
  if (!A) return 0;
  if (typeof A === "string") return i7(A);
  return A.reduce((B, Q) => {
    if (C4I(Q)) return B + i7(Q.text);
    else if (V4I(Q)) return B + F4I;
    return B;
  }, 0);
}
async function sQ1(A, B) {
  if (!A) return;
  if (jQ0(A) <= PQ0() * W4I) return;
  try {
    let G = await RDA(
      typeof A === "string"
        ? [{ role: "user", content: A }]
        : [{ role: "user", content: A }],
      [],
    );
    if (G && G > PQ0()) throw new OqA(B, G);
  } catch (I) {
    if (I instanceof OqA) throw I;
    BA(I instanceof Error ? I : Error(String(I)), DY0);
  }
}
var W4I = 0.5,
  F4I = 1600,
  OqA;
var SQ0 = T(() => {
  HN();
  c1();
  OqA = class OqA extends Error {
    constructor(A, B) {
      super(
        `MCP tool "${A}" response (${B} tokens) exceeds maximum allowed tokens (${PQ0()}). Please use pagination, filtering, or limit parameters to reduce the response size.`,
      );
      this.name = "MCPContentTooLargeError";
    }
  };
});
class rQ1 {
  ws;
  started = !1;
  opened;
  constructor(A) {
    this.ws = A;
    ((this.opened = new Promise((B, Q) => {
      if (this.ws.readyState === zT.OPEN) B();
      else
        (this.ws.on("open", () => {
          B();
        }),
          this.ws.on("error", (I) => {
            Q(I);
          }));
    })),
      this.ws.on("message", this.onMessageHandler),
      this.ws.on("error", this.onErrorHandler),
      this.ws.on("close", this.onCloseHandler));
  }
  onclose;
  onerror;
  onmessage;
  onMessageHandler = (A) => {
    try {
      let B = JSON.parse(A.toString("utf-8")),
        Q = NT.parse(B);
      this.onmessage?.(Q);
    } catch (B) {
      this.onErrorHandler(B);
    }
  };
  onErrorHandler = (A) => {
    this.onerror?.(A instanceof Error ? A : Error("Failed to process message"));
  };
  onCloseHandler = () => {
    (this.onclose?.(),
      this.ws.off("message", this.onMessageHandler),
      this.ws.off("error", this.onErrorHandler),
      this.ws.off("close", this.onCloseHandler));
  };
  async start() {
    if (this.started)
      throw Error("Start can only be called once per transport.");
    if ((await this.opened, this.ws.readyState !== zT.OPEN))
      throw Error("WebSocket is not open. Cannot start transport.");
    this.started = !0;
  }
  async close() {
    if (this.ws.readyState === zT.OPEN || this.ws.readyState === zT.CONNECTING)
      this.ws.close();
    this.onCloseHandler();
  }
  async send(A) {
    if (this.ws.readyState !== zT.OPEN)
      throw Error("WebSocket is not open. Cannot send message.");
    let B = JSON.stringify(A);
    try {
      await new Promise((Q, I) => {
        this.ws.send(B, (G) => {
          if (G) I(G);
          else Q();
        });
      });
    } catch (Q) {
      throw (this.onErrorHandler(Q), Q);
    }
  }
}
var Xe2 = T(() => {
  nGA();
  UD();
});
var We2 = "",
  Fe2 = "";
function Ce2(A) {
  if (Object.keys(A).length === 0) return null;
  return Object.entries(A)
    .map(([B, Q]) => `${B}: ${JSON.stringify(Q)}`)
    .join(", ");
}
function Ve2() {
  return O3.createElement(l5, null);
}
function Ke2(A, { verbose: B }) {
  return O3.createElement(H6, { result: A, verbose: B });
}
function De2() {
  return null;
}
function Ee2(A, B, { verbose: Q }) {
  let I = A,
    G = jQ0(I),
    Y =
      G > K4I
        ? `${E1.warning} Large MCP response (~${yZ(G)} tokens), this can fill up context quickly`
        : null,
    J;
  if (Array.isArray(I)) {
    let X = I.map((W, F) => {
      if (W.type === "image")
        return O3.createElement(
          S,
          {
            key: F,
            justifyContent: "space-between",
            overflowX: "hidden",
            width: "100%",
          },
          O3.createElement(
            j0,
            { height: 1 },
            O3.createElement(U, null, "[Image]"),
          ),
        );
      let C =
        W.type === "text" && "text" in W && W.text !== null && W.text !== void 0
          ? String(W.text)
          : "";
      return O3.createElement(dH, { key: F, content: C, verbose: Q });
    });
    J = O3.createElement(S, { flexDirection: "column", width: "100%" }, X);
  } else if (!I)
    J = O3.createElement(
      S,
      { justifyContent: "space-between", overflowX: "hidden", width: "100%" },
      O3.createElement(
        j0,
        { height: 1 },
        O3.createElement(U, { dimColor: !0 }, "(No content)"),
      ),
    );
  else J = O3.createElement(dH, { content: I, verbose: Q });
  if (Y)
    return O3.createElement(
      S,
      { flexDirection: "column" },
      O3.createElement(
        j0,
        { height: 1 },
        O3.createElement(U, { color: "warning" }, Y),
      ),
      J,
    );
  return J;
}
var O3,
  K4I = 1e4;
var He2 = T(() => {
  nA();
  UF();
  qX();
  h4A();
  L8();
  s2();
  SQ0();
  O3 = IA(KA(), 1);
});
var D4I, E4I, ze2;
var Ue2 = T(() => {
  e2();
  He2();
  ((D4I = _.object({}).passthrough()),
    (E4I = _.string().describe("MCP tool execution result")),
    (ze2 = {
      isMcp: !0,
      isEnabled() {
        return !0;
      },
      isConcurrencySafe() {
        return !1;
      },
      isReadOnly() {
        return !1;
      },
      isDestructive() {
        return !1;
      },
      isOpenWorld() {
        return !1;
      },
      name: "mcp",
      async description() {
        return Fe2;
      },
      async prompt() {
        return We2;
      },
      inputSchema: D4I,
      outputSchema: E4I,
      async call() {
        return { data: "" };
      },
      async checkPermissions() {
        return {
          behavior: "passthrough",
          message: "MCPTool requires permission.",
        };
      },
      renderToolUseMessage: Ce2,
      userFacingName: () => "mcp",
      renderToolUseRejectedMessage: Ve2,
      renderToolUseErrorMessage: Ke2,
      renderToolUseProgressMessage: De2,
      renderToolResultMessage: Ee2,
      mapToolResultToToolResultBlockParam(A, B) {
        return { tool_use_id: B, type: "tool_result", content: A };
      },
    }));
});
function H4I(A) {
  return A.scope === "project" || A.scope === "local";
}
async function z4I(A, B) {
  if (!B.headersHelper) return null;
  if ("scope" in B && H4I(B) && !K5()) {
    if (!fX(!0)) {
      let I = Error(
        `Security: headersHelper for MCP server '${A}' executed before workspace trust is confirmed. If you see this message, post in ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.FEEDBACK_CHANNEL}.`,
      );
      return (
        P$("MCP headersHelper invoked before trust check", I),
        GA("tengu_mcp_headersHelper_missing_trust", {}),
        null
      );
    }
  }
  try {
    P0(A, "Executing headersHelper to get dynamic headers");
    let Q = await B5(B.headersHelper, [], { shell: !0, timeout: 1e4 });
    if (Q.code !== 0 || !Q.stdout)
      throw Error(
        `headersHelper for MCP server '${A}' did not return a valid value`,
      );
    let I = Q.stdout.trim(),
      G = JSON.parse(I);
    if (typeof G !== "object" || G === null || Array.isArray(G))
      throw Error(
        `headersHelper for MCP server '${A}' must return a JSON object with string key-value pairs`,
      );
    for (let [Z, Y] of Object.entries(G))
      if (typeof Y !== "string")
        throw Error(
          `headersHelper for MCP server '${A}' returned non-string value for key "${Z}": ${typeof Y}`,
        );
    return (
      P0(
        A,
        `Successfully retrieved ${Object.keys(G).length} headers from headersHelper`,
      ),
      G
    );
  } catch (Q) {
    return (
      OG(
        A,
        `Error getting headers from headersHelper: ${Q instanceof Error ? Q.message : String(Q)}`,
      ),
      BA(
        Error(
          `Error getting MCP headers from headersHelper for server '${A}': ${Q instanceof Error ? Q.message : String(Q)}`,
        ),
        fJ0,
      ),
      null
    );
  }
}
async function oQ1(A, B) {
  let Q = B.headers || {},
    I = (await z4I(A, B)) || {};
  return { ...Q, ...I };
}
var we2 = T(() => {
  Q5();
  kB();
  c1();
  C0();
  H0();
  i0();
});
class yQ0 {
  serverName;
  sendMcpMessage;
  isClosed = !1;
  onclose;
  onerror;
  onmessage;
  constructor(A, B) {
    this.serverName = A;
    this.sendMcpMessage = B;
  }
  async start() {}
  async send(A) {
    if (this.isClosed) throw Error("Transport is closed");
    let B = await this.sendMcpMessage(this.serverName, A);
    if (this.onmessage) this.onmessage(B);
  }
  async close() {
    if (this.isClosed) return;
    ((this.isClosed = !0), this.onclose?.());
  }
}
function w4I() {
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || 1e8;
}
function tQ1() {
  return parseInt(process.env.MCP_TIMEOUT || "", 10) || 30000;
}
function $4I() {
  return parseInt(process.env.MCP_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 3;
}
function N4I(A) {
  return !A.name.startsWith("mcp__ide__") || q4I.includes(A.name);
}
function $e2(A, B) {
  return `${A}-${JSON.stringify(B)}`;
}
async function hIA(A, B) {
  let Q = $e2(A, B);
  try {
    let I = await i7A(A, B);
    if (I.type === "connected") await I.cleanup();
  } catch {}
  i7A.cache.delete(Q);
}
async function vx(A, B, Q) {
  return Me2({ client: Q, tool: A, args: B, signal: a9().signal });
}
async function Qo(A, B) {
  try {
    await hIA(A, B);
    let Q = await i7A(A, B);
    if (Q.type !== "connected") return { client: Q, tools: [], commands: [] };
    let I = !!Q.capabilities?.resources,
      [G, Z, Y] = await Promise.all([
        kQ0(Q),
        Ne2(Q),
        I ? qe2(Q) : Promise.resolve([]),
      ]),
      J = [];
    if (I) {
      if (![$b, qb].some((W) => G.some((F) => F.name === W.name)))
        J.push($b, qb);
    }
    return {
      client: Q,
      tools: [...G, ...J],
      commands: Z,
      resources: Y.length > 0 ? Y : void 0,
    };
  } catch (Q) {
    return (
      OG(
        A,
        `Error during reconnection: ${Q instanceof Error ? Q.message : String(Q)}`,
      ),
      {
        client: { name: A, type: "failed", config: B },
        tools: [],
        commands: [],
      }
    );
  }
}
async function L4I(A, B, Q) {
  for (let I = 0; I < A.length; I += B) {
    let G = A.slice(I, I + B);
    await Promise.all(G.map(Q));
  }
}
async function di1(A, B) {
  let Q = !1,
    I = Object.entries(B ?? (await US()).servers),
    G = I.length,
    Z = I.filter(([F, C]) => C.type === "stdio").length,
    Y = I.filter(([F, C]) => C.type === "sse").length,
    J = I.filter(([F, C]) => C.type === "http").length,
    X = I.filter(([F, C]) => C.type === "sse-ide").length,
    W = I.filter(([F, C]) => C.type === "ws-ide").length;
  await L4I(I, $4I(), async ([F, C]) => {
    try {
      if (DrA(F)) {
        A({
          client: { name: F, type: "disabled", config: C },
          tools: [],
          commands: [],
        });
        return;
      }
      let K = await i7A(F, C, {
        totalServers: G,
        stdioCount: Z,
        sseCount: Y,
        httpCount: J,
        sseIdeCount: X,
        wsIdeCount: W,
      });
      if (K.type !== "connected") {
        A({ client: K, tools: [], commands: [] });
        return;
      }
      let D = !!K.capabilities?.resources,
        [E, H, w] = await Promise.all([
          kQ0(K),
          Ne2(K),
          D ? qe2(K) : Promise.resolve([]),
        ]),
        L = [];
      if (D && !Q) ((Q = !0), L.push($b, qb));
      A({
        client: K,
        tools: [...E, ...L],
        commands: H,
        resources: w.length > 0 ? w : void 0,
      });
    } catch (V) {
      (OG(
        F,
        `Error fetching tools/commands/resources: ${V instanceof Error ? V.message : String(V)}`,
      ),
        A({
          client: { name: F, type: "failed", config: C },
          tools: [],
          commands: [],
        }));
    }
  });
}
function Le2(A, B) {
  switch (A.type) {
    case "text":
      return [{ type: "text", text: A.text }];
    case "image":
      return [
        {
          type: "image",
          source: {
            data: String(A.data),
            media_type: A.mimeType || "image/jpeg",
            type: "base64",
          },
        },
      ];
    case "resource": {
      let Q = A.resource,
        I = `[Resource from ${B} at ${Q.uri}] `;
      if ("text" in Q) return [{ type: "text", text: `${I}${Q.text}` }];
      else if ("blob" in Q)
        if (U4I.has(Q.mimeType ?? "")) {
          let Z = [];
          if (I) Z.push({ type: "text", text: I });
          return (
            Z.push({
              type: "image",
              source: {
                data: Q.blob,
                media_type: Q.mimeType || "image/jpeg",
                type: "base64",
              },
            }),
            Z
          );
        } else
          return [
            {
              type: "text",
              text: `${I}Base64 data (${Q.mimeType || "unknown type"}) ${Q.blob}`,
            },
          ];
      return [];
    }
    case "resource_link": {
      let Q = A,
        I = `[Resource link: ${Q.name}] ${Q.uri}`;
      if (Q.description) I += ` (${Q.description})`;
      return [{ type: "text", text: I }];
    }
    default:
      return [];
  }
}
async function CB0(A, B, Q) {
  if (A && typeof A === "object" && "toolResult" in A) {
    let G = A;
    if (Q !== "ide") await sQ1(String(G.toolResult), B);
    return String(G.toolResult);
  }
  if (
    A &&
    typeof A === "object" &&
    "structuredContent" in A &&
    A.structuredContent !== void 0
  ) {
    let Z = JSON.stringify(A.structuredContent);
    if (Q !== "ide") await sQ1(Z, B);
    return Z;
  }
  if (
    A &&
    typeof A === "object" &&
    "content" in A &&
    Array.isArray(A.content)
  ) {
    let Y = A.content.map((J) => Le2(J, Q)).flat();
    if (Q !== "ide") await sQ1(Y, B);
    return Y;
  }
  let I = `Unexpected response format from tool ${B}`;
  throw (OG(Q, I), Error(I));
}
async function Me2({
  client: { client: A, name: B },
  tool: Q,
  args: I,
  meta: G,
  signal: Z,
}) {
  let Y = Date.now(),
    J;
  try {
    (P0(B, `Calling MCP tool: ${Q}`),
      (J = setInterval(() => {
        let C = Date.now() - Y,
          K = `${Math.floor(C / 1000)}s`;
        P0(B, `Tool '${Q}' still running (${K} elapsed)`);
      }, 30000)));
    let X = await A.callTool({ name: Q, arguments: I, _meta: G }, vf, {
      signal: Z,
      timeout: w4I(),
    });
    if ("isError" in X && X.isError) {
      let C = "Unknown error";
      if ("content" in X && Array.isArray(X.content) && X.content.length > 0) {
        let V = X.content[0];
        if (V && typeof V === "object" && "text" in V) C = V.text;
      } else if ("error" in X) C = String(X.error);
      throw (OG(B, C), Error(C));
    }
    let W = Date.now() - Y,
      F =
        W < 1000
          ? `${W}ms`
          : W < 60000
            ? `${Math.floor(W / 1000)}s`
            : `${Math.floor(W / 60000)}m ${Math.floor((W % 60000) / 1000)}s`;
    return (
      P0(B, `Tool '${Q}' completed successfully in ${F}`),
      await CB0(X, Q, B)
    );
  } catch (X) {
    if (J !== void 0) clearInterval(J);
    let W = Date.now() - Y;
    if (X instanceof Error && X.name !== "AbortError")
      P0(B, `Tool '${Q}' failed after ${Math.floor(W / 1000)}s: ${X.message}`);
    if (X instanceof OqA) throw X;
    if (!(X instanceof Error) || X.name !== "AbortError") throw X;
  } finally {
    if (J !== void 0) clearInterval(J);
  }
}
function M4I(A) {
  if (A.message.content[0]?.type !== "tool_use") return;
  return A.message.content[0].id;
}
async function Oe2(A, B) {
  let Q = [],
    I = [],
    G = await Promise.allSettled(
      Object.entries(A).map(async ([Z, Y]) => {
        let J = new yQ0(Z, B),
          X = new JMA(
            {
              name: "claude-code",
              version:
                {
                  ISSUES_EXPLAINER:
                    "report the issue at https://github.com/anthropics/claude-code/issues",
                  PACKAGE_URL: "@anthropic-ai/claude-code",
                  README_URL: "https://docs.claude.com/s/claude-code",
                  VERSION: "2.0.42",
                  FEEDBACK_CHANNEL:
                    "https://github.com/anthropics/claude-code/issues",
                }.VERSION ?? "unknown",
            },
            { capabilities: {} },
          );
        try {
          await X.connect(J);
          let W = X.getServerCapabilities(),
            F = {
              type: "connected",
              name: Z,
              capabilities: W || {},
              client: X,
              config: { ...Y, scope: "dynamic" },
              cleanup: async () => {
                await X.close();
              },
            },
            C = [];
          if (W?.tools) {
            let V = await kQ0(F);
            C.push(...V);
          }
          return { client: F, tools: C };
        } catch (W) {
          return (
            OG(Z, `Failed to connect SDK MCP server: ${W}`),
            {
              client: {
                type: "failed",
                name: Z,
                config: { ...Y, scope: "user" },
              },
              tools: [],
            }
          );
        }
      }),
    );
  for (let Z of G)
    if (Z.status === "fulfilled")
      (Q.push(Z.value.client), I.push(...Z.value.tools));
  return { clients: Q, tools: I };
}
var U4I, q4I, i7A, kQ0, qe2, Ne2, QsA;
var gj = T(() => {
  a2();
  nGA();
  t30();
  m70();
  GG0();
  YG0();
  UD();
  FG0();
  c1();
  yH();
  H0();
  zW();
  i0();
  BU();
  g11();
  SQ0();
  kF();
  Xe2();
  Z2A();
  ag();
  vG();
  Ue2();
  b01();
  f01();
  RB1();
  aN();
  we2();
  zZA();
  U4I = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
  q4I = ["mcp__ide__executeCode", "mcp__ide__getDiagnostics"];
  i7A = I0(async (A, B, Q) => {
    let I = Date.now();
    try {
      let G,
        Z = io();
      if (B.type === "sse") {
        let N = new Kt(A, B),
          $ = await oQ1(A, B),
          O = {
            authProvider: N,
            requestInit: {
              headers: { "User-Agent": qn(), ...$ },
              signal: AbortSignal.timeout(60000),
            },
          };
        if (Object.keys($).length > 0)
          O.eventSourceInit = {
            fetch: async (P, k) => {
              let b = {},
                x = await N.tokens();
              if (x) b.Authorization = `Bearer ${x.access_token}`;
              let n = J2A();
              return fetch(P, {
                ...k,
                ...n,
                headers: {
                  "User-Agent": qn(),
                  ...b,
                  ...k?.headers,
                  ...$,
                  Accept: "text/event-stream",
                },
              });
            },
          };
        ((G = new PMA(new URL(B.url), O)),
          P0(A, "SSE transport initialized, awaiting connection"));
      } else if (B.type === "sse-ide") {
        P0(A, `Setting up SSE-IDE transport to ${B.url}`);
        let N = J2A(),
          $ = N.dispatcher
            ? {
                eventSourceInit: {
                  fetch: async (O, P) => {
                    return fetch(O, {
                      ...P,
                      ...N,
                      headers: { "User-Agent": qn(), ...P?.headers },
                    });
                  },
                },
              }
            : {};
        G = new PMA(new URL(B.url), Object.keys($).length > 0 ? $ : void 0);
      } else if (B.type === "ws-ide") {
        let N = IU1(),
          $ = {
            headers: {
              "User-Agent": qn(),
              ...(B.authToken && {
                "X-Claude-Code-Ide-Authorization": B.authToken,
              }),
            },
            agent: DFA(B.url),
            ...(N || {}),
          },
          O = new iGA.default(
            B.url,
            ["mcp"],
            Object.keys($).length > 0 ? $ : void 0,
          );
        G = new rQ1(O);
      } else if (B.type === "ws") {
        P0(A, `Initializing WebSocket transport to ${B.url}`);
        let N = await oQ1(A, B),
          $ = IU1(),
          O = {
            headers: {
              "User-Agent": qn(),
              ...(Z && { Authorization: `Bearer ${Z}` }),
              ...N,
            },
            agent: DFA(B.url),
            ...($ || {}),
          };
        P0(
          A,
          `WebSocket transport options: ${JSON.stringify({ url: B.url, headers: O.headers, hasSessionAuth: !!Z })}`,
        );
        let P = new iGA.default(
          B.url,
          ["mcp"],
          Object.keys(O).length > 0 ? O : void 0,
        );
        G = new rQ1(P);
      } else if (B.type === "http") {
        (P0(A, `Initializing HTTP transport to ${B.url}`),
          P0(
            A,
            `Node version: ${process.version}, Platform: ${process.platform}`,
          ),
          P0(
            A,
            `Environment: ${JSON.stringify({ NODE_OPTIONS: process.env.NODE_OPTIONS || "not set", UV_THREADPOOL_SIZE: process.env.UV_THREADPOOL_SIZE || "default", HTTP_PROXY: process.env.HTTP_PROXY || "not set", HTTPS_PROXY: process.env.HTTPS_PROXY || "not set", NO_PROXY: process.env.NO_PROXY || "not set" })}`,
          ));
        let N = new Kt(A, B),
          $ = await oQ1(A, B),
          O = J2A();
        P0(
          A,
          `Proxy options: ${O.dispatcher ? "custom dispatcher" : "default"}`,
        );
        let P = {
          authProvider: N,
          requestInit: {
            ...O,
            headers: {
              "User-Agent": qn(),
              ...(Z && { Authorization: `Bearer ${Z}` }),
              ...$,
            },
            signal: AbortSignal.timeout(60000),
          },
        };
        (P0(
          A,
          `HTTP transport options: ${JSON.stringify({ url: B.url, headers: P.requestInit?.headers, hasAuthProvider: !!N, timeoutMs: 60000 })}`,
        ),
          (G = new p81(new URL(B.url), P)),
          P0(A, "HTTP transport created successfully"));
      } else if (B.type === "sdk")
        throw Error("SDK servers should be handled in print.ts");
      else {
        let N = process.env.CLAUDE_CODE_SHELL_PREFIX || B.command,
          $ = process.env.CLAUDE_CODE_SHELL_PREFIX
            ? [[B.command, ...B.args].join(" ")]
            : B.args;
        G = new q81({
          command: N,
          args: $,
          env: { ...process.env, ...B.env },
          stderr: "pipe",
        });
      }
      if (B.type === "stdio" || !B.type) {
        let N = G;
        if (N.stderr)
          N.stderr.on("data", ($) => {
            let O = $.toString().trim();
            if (O) OG(A, `Server stderr: ${O}`);
          });
      }
      let Y = new JMA(
        {
          name: "claude-code",
          version:
            {
              ISSUES_EXPLAINER:
                "report the issue at https://github.com/anthropics/claude-code/issues",
              PACKAGE_URL: "@anthropic-ai/claude-code",
              README_URL: "https://docs.claude.com/s/claude-code",
              VERSION: "2.0.42",
              FEEDBACK_CHANNEL:
                "https://github.com/anthropics/claude-code/issues",
            }.VERSION ?? "unknown",
        },
        { capabilities: { roots: {}, ...{} } },
      );
      if (B.type === "http")
        P0(A, "Client created, setting up request handler");
      if (
        (Y.setRequestHandler(b41, async () => {
          return (
            P0(A, "Received ListRoots request from server"),
            { roots: [{ uri: `file://${GQ()}` }] }
          );
        }),
        P0(A, `Starting connection with timeout of ${tQ1()}ms`),
        B.type === "http")
      ) {
        P0(A, `Testing basic HTTP connectivity to ${B.url}`);
        try {
          let N = new URL(B.url);
          if (
            (P0(
              A,
              `Parsed URL: host=${N.hostname}, port=${N.port || "default"}, protocol=${N.protocol}`,
            ),
            N.hostname === "127.0.0.1" || N.hostname === "localhost")
          )
            P0(A, `Using loopback address: ${N.hostname}`);
        } catch (N) {
          P0(A, `Failed to parse URL: ${N}`);
        }
      }
      let J = Y.connect(G),
        X = new Promise((N, $) => {
          let O = setTimeout(() => {
            let P = Date.now() - I;
            (P0(
              A,
              `Connection timeout triggered after ${P}ms (limit: ${tQ1()}ms)`,
            ),
              $(
                Error(
                  `Connection to MCP server "${A}" timed out after ${tQ1()}ms`,
                ),
              ));
          }, tQ1());
          J.then(
            () => {
              clearTimeout(O);
            },
            (P) => {
              clearTimeout(O);
            },
          );
        });
      try {
        await Promise.race([J, X]);
        let N = Date.now() - I;
        P0(A, `Successfully connected to ${B.type} server in ${N}ms`);
      } catch (N) {
        let $ = Date.now() - I;
        if (B.type === "sse" && N instanceof Error) {
          if (
            (P0(
              A,
              `SSE Connection failed after ${$}ms: ${JSON.stringify({ url: B.url, error: N.message, errorType: N.constructor.name, stack: N.stack })}`,
            ),
            OG(A, N),
            N instanceof pV)
          )
            return (
              GA("tengu_mcp_server_needs_auth", {}),
              P0(A, "Authentication required for SSE server"),
              { name: A, type: "needs-auth", config: B }
            );
        } else if (B.type === "http" && N instanceof Error) {
          let O = N;
          if (
            (P0(
              A,
              `HTTP Connection failed after ${$}ms: ${N.message} (code: ${O.code || "none"}, errno: ${O.errno || "none"})`,
            ),
            OG(A, N),
            N instanceof pV)
          )
            return (
              GA("tengu_mcp_server_needs_auth", {}),
              P0(A, "Authentication required for HTTP server"),
              { name: A, type: "needs-auth", config: B }
            );
        } else if (B.type === "sse-ide" || B.type === "ws-ide")
          GA("tengu_mcp_ide_server_connection_failed", {});
        throw N;
      }
      let W = Y.getServerCapabilities(),
        F = Y.getServerVersion(),
        C = Y.getInstructions();
      if (
        (P0(
          A,
          `Connection established with capabilities: ${JSON.stringify({ hasTools: !!W?.tools, hasPrompts: !!W?.prompts, hasResources: !!W?.resources, serverVersion: F || "unknown" })}`,
        ),
        B.type === "sse-ide" || B.type === "ws-ide")
      ) {
        GA("tengu_mcp_ide_server_connection_succeeded", { serverVersion: F });
        try {
          GNQ(Y);
        } catch (N) {
          OG(A, `Failed to send ide_connected notification: ${N}`);
        }
      }
      let V = Date.now(),
        K = !1,
        D = Y.onerror,
        E = Y.onclose;
      ((Y.onerror = (N) => {
        let $ = Date.now() - V;
        K = !0;
        let O = B.type || "stdio";
        if (
          (P0(
            A,
            `${O.toUpperCase()} connection dropped after ${Math.floor($ / 1000)}s uptime`,
          ),
          N.message)
        )
          if (N.message.includes("ECONNRESET"))
            P0(A, "Connection reset - server may have crashed or restarted");
          else if (N.message.includes("ETIMEDOUT"))
            P0(A, "Connection timeout - network issue or server unresponsive");
          else if (N.message.includes("ECONNREFUSED"))
            P0(A, "Connection refused - server may be down");
          else if (N.message.includes("EPIPE"))
            P0(A, "Broken pipe - server closed connection unexpectedly");
          else if (N.message.includes("EHOSTUNREACH"))
            P0(A, "Host unreachable - network connectivity issue");
          else if (N.message.includes("ESRCH"))
            P0(A, "Process not found - stdio server process terminated");
          else if (N.message.includes("spawn"))
            P0(A, "Failed to spawn process - check command and permissions");
          else P0(A, `Connection error: ${N.message}`);
        if (D) D(N);
      }),
        (Y.onclose = () => {
          let N = Date.now() - V,
            $ = B.type ?? "unknown";
          if (
            (P0(
              A,
              `${$.toUpperCase()} connection closed after ${Math.floor(N / 1000)}s (${K ? "with errors" : "cleanly"})`,
            ),
            E)
          )
            E();
        }));
      let H = async () => {
          if (B.type === "stdio")
            try {
              let $ = G.pid;
              if ($) {
                P0(A, "Sending SIGINT to MCP server process");
                try {
                  process.kill($, "SIGINT");
                } catch (O) {
                  P0(A, `Error sending SIGINT: ${O}`);
                  return;
                }
                await new Promise(async (O) => {
                  let P = !1,
                    k = setInterval(() => {
                      try {
                        process.kill($, 0);
                      } catch {
                        if (!P)
                          ((P = !0),
                            clearInterval(k),
                            clearTimeout(b),
                            P0(A, "MCP server process exited cleanly"),
                            O());
                      }
                    }, 50),
                    b = setTimeout(() => {
                      if (!P)
                        ((P = !0),
                          clearInterval(k),
                          P0(
                            A,
                            "Cleanup timeout reached, stopping process monitoring",
                          ),
                          O());
                    }, 600);
                  try {
                    if ((await new Promise((x) => setTimeout(x, 100)), !P)) {
                      try {
                        (process.kill($, 0),
                          P0(
                            A,
                            "SIGINT failed, sending SIGTERM to MCP server process",
                          ));
                        try {
                          process.kill($, "SIGTERM");
                        } catch (x) {
                          (P0(A, `Error sending SIGTERM: ${x}`),
                            (P = !0),
                            clearInterval(k),
                            clearTimeout(b),
                            O());
                          return;
                        }
                      } catch {
                        ((P = !0), clearInterval(k), clearTimeout(b), O());
                        return;
                      }
                      if ((await new Promise((x) => setTimeout(x, 400)), !P))
                        try {
                          (process.kill($, 0),
                            P0(
                              A,
                              "SIGTERM failed, sending SIGKILL to MCP server process",
                            ));
                          try {
                            process.kill($, "SIGKILL");
                          } catch (x) {
                            P0(A, `Error sending SIGKILL: ${x}`);
                          }
                        } catch {
                          ((P = !0), clearInterval(k), clearTimeout(b), O());
                        }
                    }
                    if (!P) ((P = !0), clearInterval(k), clearTimeout(b), O());
                  } catch {
                    if (!P) ((P = !0), clearInterval(k), clearTimeout(b), O());
                  }
                });
              }
            } catch (N) {
              P0(A, `Error terminating process: ${N}`);
            }
          try {
            await Y.close();
          } catch (N) {
            P0(A, `Error closing client: ${N}`);
          }
        },
        w = nY(H),
        L = async () => {
          (w?.(), await H());
        };
      return (
        GA("tengu_mcp_server_connection_succeeded", {}),
        {
          name: A,
          client: Y,
          type: "connected",
          capabilities: W ?? {},
          serverInfo: F,
          instructions: C,
          config: B,
          cleanup: L,
        }
      );
    } catch (G) {
      GA("tengu_mcp_server_connection_failed", {
        totalServers: Q?.totalServers || 1,
        stdioCount: Q?.stdioCount || (B.type === "stdio" ? 1 : 0),
        sseCount: Q?.sseCount || (B.type === "sse" ? 1 : 0),
        httpCount: Q?.httpCount || (B.type === "http" ? 1 : 0),
        sseIdeCount: Q?.sseIdeCount || (B.type === "sse-ide" ? 1 : 0),
        wsIdeCount: Q?.wsIdeCount || (B.type === "ws-ide" ? 1 : 0),
        transportType: B.type,
      });
      let Z = Date.now() - (I || 0);
      return (
        P0(
          A,
          `Connection failed after ${Z}ms: ${G instanceof Error ? G.message : String(G)}`,
        ),
        OG(
          A,
          `Connection failed: ${G instanceof Error ? G.message : String(G)}`,
        ),
        { name: A, type: "failed", config: B }
      );
    }
  }, $e2);
  ((kQ0 = I0(async (A) => {
    if (A.type !== "connected") return [];
    try {
      if (!A.capabilities?.tools) return [];
      let B = await A.client.request({ method: "tools/list" }, JZA);
      return l7A(B.tools)
        .map((I) => ({
          ...ze2,
          name: `mcp__${x3(A.name)}__${x3(I.name)}`,
          originalMcpToolName: I.name,
          isMcp: !0,
          async description() {
            return I.description ?? "";
          },
          async prompt() {
            return I.description ?? "";
          },
          isConcurrencySafe() {
            return I.annotations?.readOnlyHint ?? !1;
          },
          isReadOnly() {
            return I.annotations?.readOnlyHint ?? !1;
          },
          isDestructive() {
            return I.annotations?.destructiveHint ?? !1;
          },
          isOpenWorld() {
            return I.annotations?.openWorldHint ?? !1;
          },
          inputJSONSchema: I.inputSchema,
          async call(G, Z, Y, J) {
            let X = M4I(J),
              W = X ? { "claudecode/toolUseId": X } : {};
            return {
              data: await Me2({
                client: A,
                tool: I.name,
                args: G,
                meta: W,
                signal: Z.abortController.signal,
              }),
            };
          },
          userFacingName() {
            let G = I.annotations?.title || I.name;
            return `${A.name} - ${G} (MCP)`;
          },
        }))
        .filter(N4I);
    } catch (B) {
      return (
        OG(
          A.name,
          `Failed to fetch tools: ${B instanceof Error ? B.message : String(B)}`,
        ),
        []
      );
    }
  })),
    (qe2 = I0(async (A) => {
      if (A.type !== "connected") return [];
      try {
        if (!A.capabilities?.resources) return [];
        let B = await A.client.request({ method: "resources/list" }, $l);
        if (!B.resources) return [];
        return B.resources.map((Q) => ({ ...Q, server: A.name }));
      } catch (B) {
        return (
          OG(
            A.name,
            `Failed to fetch resources: ${B instanceof Error ? B.message : String(B)}`,
          ),
          []
        );
      }
    })),
    (Ne2 = I0(async (A) => {
      if (A.type !== "connected") return [];
      let B = A;
      try {
        if (!A.capabilities?.prompts) return [];
        let Q = await A.client.request({ method: "prompts/list" }, YZA);
        if (!Q.prompts) return [];
        return l7A(Q.prompts).map((G) => {
          let Z = Object.values(G.arguments ?? {}).map((Y) => Y.name);
          return {
            type: "prompt",
            name: "mcp__" + x3(B.name) + "__" + G.name,
            description: G.description ?? "",
            hasUserSpecifiedDescription: !!G.description,
            isEnabled: () => !0,
            isHidden: !1,
            isMcp: !0,
            progressMessage: "running",
            userFacingName() {
              let Y = G.title || G.name;
              return `${B.name}:${Y} (MCP)`;
            },
            argNames: Z,
            source: "mcp",
            async getPromptForCommand(Y) {
              let J = Y.split(" ");
              try {
                return (
                  await B.client.getPrompt({
                    name: G.name,
                    arguments: WG0(Z, J),
                  })
                ).messages.flatMap((W) => Le2(W.content, A.name));
              } catch (X) {
                throw (
                  OG(
                    A.name,
                    `Error running command '${G.name}': ${X instanceof Error ? X.message : String(X)}`,
                  ),
                  X
                );
              }
            },
          };
        });
      } catch (Q) {
        return (
          OG(
            A.name,
            `Failed to fetch commands: ${Q instanceof Error ? Q.message : String(Q)}`,
          ),
          []
        );
      }
    })));
  QsA = I0(async (A) => {
    return new Promise((B) => {
      let Q = 0,
        I = 0;
      if (((Q = Object.keys(A).length), Q === 0)) {
        B({ clients: [], tools: [], commands: [] });
        return;
      }
      let G = [],
        Z = [],
        Y = [];
      di1((J) => {
        if (
          (G.push(J.client),
          Z.push(...J.tools),
          Y.push(...J.commands),
          I++,
          I >= Q)
        ) {
          let X = Y.reduce((W, F) => {
            let C =
              F.name.length +
              (F.description ?? "").length +
              (F.argumentHint ?? "").length;
            return W + C;
          }, 0);
          (GA("tengu_mcp_tools_commands_loaded", {
            tools_count: Z.length,
            commands_count: Y.length,
            commands_metadata_length: X,
          }),
            B({ clients: G, tools: Z, commands: Y }));
        }
      }, A).catch((J) => {
        (OG(
          "prefetchAllMcpResources",
          `Failed to get MCP resources: ${J instanceof Error ? J.message : String(J)}`,
        ),
          B({ clients: [], tools: [], commands: [] }));
      });
    });
  });
});
var Se2 = {};
M$(Se2, { ripgrepMain: () => j4I });
import { createRequire as O4I } from "module";
import { fileURLToPath as R4I } from "url";
import { dirname as T4I, join as P4I } from "path";
function j4I(A) {
  let B;
  if (process.env.RIPGREP_NODE_PATH)
    B = EA(process.env.RIPGREP_NODE_PATH).ripgrepMain;
  else {
    let Q = P4I(T4I(R4I(import.meta.url)), "ripgrep.node");
    B = O4I(import.meta.url)(Q).ripgrepMain;
  }
  return B(["--no-config", ...A]);
}
var ye2 = () => {};
import { posix as ke2, win32 as _e2 } from "path";
function S4I() {
  let A = process.argv[1] || "",
    B = process.execPath || process.argv[0] || "";
  if (EB() === "windows")
    ((A = A.split(_e2.sep).join(ke2.sep)),
      (B = B.split(_e2.sep).join(ke2.sep)));
  let Q = [A, B],
    I = [
      "/build-ant/",
      "/build-external/",
      "/build-external-native/",
      "/build-ant-native/",
    ];
  return Q.some((G) => I.some((Z) => G.includes(Z)));
}
function k4I(A) {
  let B = `${A.name}: ${A.message}`;
  return y4I.some((Q) => Q.test(B));
}
function ve2() {
  let A = process.listeners("warning");
  if (eQ1 && A.includes(eQ1)) return;
  if (!S4I()) process.removeAllListeners("warning");
  ((eQ1 = (Q) => {
    try {
      let I = `${Q.name}: ${Q.message.slice(0, 50)}`,
        G = xe2.get(I) || 0;
      xe2.set(I, G + 1);
      let Z = k4I(Q);
      if (
        (GA("tengu_node_warning", {
          is_internal: Z ? 1 : 0,
          occurrence_count: G + 1,
          classname: Q.name,
          ...!1,
        }),
        process.env.CLAUDE_DEBUG === "true")
      )
        g(`${Z ? "[Internal Warning]" : "[Warning]"} ${Q.toString()}`, {
          level: "warn",
        });
    } catch {}
  }),
    process.on("warning", eQ1));
}
var xe2,
  y4I,
  eQ1 = null;
var be2 = T(() => {
  H0();
  C0();
  E5();
  xe2 = new Map();
  y4I = [
    /MaxListenersExceededWarning.*AbortSignal/,
    /MaxListenersExceededWarning.*EventTarget/,
  ];
});
function he2() {}
function ge2() {
  let A = N0() || {},
    B = L1().env || {},
    Q = A.env || {};
  for (let [I, G] of Object.entries(B))
    if (fe2.has(I.toUpperCase())) process.env[I] = G;
  for (let [I, G] of Object.entries(Q))
    if (fe2.has(I.toUpperCase())) process.env[I] = G;
  he2();
}
function vQ0() {
  let A = N0() || {};
  (Object.assign(process.env, L1().env),
    Object.assign(process.env, A.env),
    he2());
}
var fe2;
var bQ0 = T(() => {
  kB();
  OQ();
  fe2 = new Set([
    "ANTHROPIC_API_KEY",
    "ANTHROPIC_AUTH_TOKEN",
    "ANTHROPIC_BASE_URL",
    "ANTHROPIC_CUSTOM_HEADERS",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL",
    "ANTHROPIC_DEFAULT_OPUS_MODEL",
    "ANTHROPIC_DEFAULT_SONNET_MODEL",
    "ANTHROPIC_MODEL",
    "ANTHROPIC_SMALL_FAST_MODEL",
    "ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION",
    "AWS_BEARER_TOKEN_BEDROCK",
    "AWS_DEFAULT_REGION",
    "AWS_PROFILE",
    "AWS_REGION",
    "BASH_DEFAULT_TIMEOUT_MS",
    "BASH_MAX_TIMEOUT_MS",
    "BASH_MAX_OUTPUT_LENGTH",
    "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR",
    "CLAUDE_CODE_API_KEY_HELPER_TTL_MS",
    "CLAUDE_CODE_ENABLE_TELEMETRY",
    "CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS",
    "CLAUDE_CODE_USE_BEDROCK",
    "CLAUDE_CODE_USE_VERTEX",
    "CLAUDE_CODE_SKIP_BEDROCK_AUTH",
    "CLAUDE_CODE_SKIP_VERTEX_AUTH",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
    "CLAUDE_CODE_DISABLE_TERMINAL_TITLE",
    "CLAUDE_CODE_SUBAGENT_MODEL",
    "DISABLE_AUTOUPDATER",
    "DISABLE_BUG_COMMAND",
    "DISABLE_COST_WARNINGS",
    "DISABLE_ERROR_REPORTING",
    "DISABLE_TELEMETRY",
    "HTTP_PROXY",
    "HTTPS_PROXY",
    "MAX_THINKING_TOKENS",
    "MCP_TIMEOUT",
    "MCP_TOOL_TIMEOUT",
    "MAX_MCP_OUTPUT_TOKENS",
    "NO_PROXY",
    "OTEL_EXPORTER_OTLP_ENDPOINT",
    "OTEL_EXPORTER_OTLP_HEADERS",
    "OTEL_EXPORTER_OTLP_LOGS_HEADERS",
    "OTEL_EXPORTER_OTLP_METRICS_HEADERS",
    "OTEL_EXPORTER_OTLP_TRACES_HEADERS",
    "OTEL_EXPORTER_OTLP_PROTOCOL",
    "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL",
    "OTEL_EXPORTER_OTLP_LOGS_ENDPOINT",
    "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL",
    "OTEL_EXPORTER_OTLP_METRICS_ENDPOINT",
    "OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY",
    "OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE",
    "OTEL_LOG_USER_PROMPTS",
    "OTEL_LOGS_EXPORTER",
    "OTEL_LOGS_EXPORT_INTERVAL",
    "OTEL_METRICS_INCLUDE_SESSION_ID",
    "OTEL_METRICS_INCLUDE_VERSION",
    "OTEL_METRICS_INCLUDE_ACCOUNT_UUID",
    "OTEL_METRICS_EXPORTER",
    "OTEL_METRIC_EXPORT_INTERVAL",
    "OTEL_RESOURCE_ATTRIBUTES",
    "USE_BUILTIN_RIPGREP",
    "VERTEX_REGION_CLAUDE_3_5_HAIKU",
    "VERTEX_REGION_CLAUDE_3_5_SONNET",
    "VERTEX_REGION_CLAUDE_3_7_SONNET",
    "VERTEX_REGION_CLAUDE_4_0_OPUS",
    "VERTEX_REGION_CLAUDE_4_0_SONNET",
    "VERTEX_REGION_CLAUDE_4_1_OPUS",
    "VERTEX_REGION_CLAUDE_HAIKU_4_5",
  ]);
});
function _4I({ filePath: A, errorDescription: B, onExit: Q, onReset: I }) {
  h1((Y, J) => {
    if (J.escape) Q();
  });
  let G = IB();
  return ID.default.createElement(
    ID.default.Fragment,
    null,
    ID.default.createElement(
      S,
      {
        flexDirection: "column",
        borderColor: "error",
        borderStyle: "round",
        padding: 1,
        width: 70,
        gap: 1,
      },
      ID.default.createElement(U, { bold: !0 }, "Configuration Error"),
      ID.default.createElement(
        S,
        { flexDirection: "column", gap: 1 },
        ID.default.createElement(
          U,
          null,
          "The configuration file at ",
          ID.default.createElement(U, { bold: !0 }, A),
          " contains invalid JSON.",
        ),
        ID.default.createElement(U, null, B),
      ),
      ID.default.createElement(
        S,
        { flexDirection: "column" },
        ID.default.createElement(U, { bold: !0 }, "Choose an option:"),
        ID.default.createElement($0, {
          options: [
            { label: "Exit and fix manually", value: "exit" },
            { label: "Reset with default configuration", value: "reset" },
          ],
          onChange: (Y) => {
            if (Y === "exit") Q();
            else I();
          },
          onCancel: Q,
        }),
      ),
    ),
    G.pending
      ? ID.default.createElement(
          U,
          { dimColor: !0 },
          "Press ",
          G.keyName,
          " again to exit",
        )
      : ID.default.createElement(AF, null),
  );
}
async function ue2({ error: A }) {
  let B = { exitOnCtrlC: !1, theme: x4I };
  await new Promise(async (Q) => {
    let { unmount: I } = await I5(
      ID.default.createElement(
        H3,
        null,
        ID.default.createElement(_4I, {
          filePath: A.filePath,
          errorDescription: A.message,
          onExit: () => {
            (I(), Q(), process.exit(1));
          },
          onReset: () => {
            (NA().writeFileSync(
              A.filePath,
              JSON.stringify(A.defaultConfig, null, 2),
              { flush: !1, encoding: "utf8" },
            ),
              I(),
              Q(),
              process.exit(0));
          },
        }),
      ),
      B,
    );
  });
}
var ID,
  x4I = "dark";
var me2 = T(() => {
  nA();
  R5();
  nA();
  m0();
  R9();
  c9();
  ID = IA(KA(), 1);
});
async function de2() {
  let A = G5();
  if (!A?.accessToken) return;
  let B = `${G4().BASE_API_URL}/api/oauth/claude_cli/client_data`;
  try {
    b4I = (
      await DB.get(B, {
        headers: {
          Authorization: `Bearer ${A.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    ).data.client_data;
  } catch (Q) {
    BA(Q, uJ0);
  }
}
var v4I, b4I;
var ce2 = T(() => {
  _I();
  QW();
  F2();
  c1();
  ((v4I = {}), (b4I = v4I));
});
function le2() {
  if (fQ0) return;
  (ie2(), (fQ0 = !0));
}
function ie2() {
  let A = TR2();
  if (A)
    X80(A, (Q, I) => {
      let G = A?.createCounter(Q, I);
      return {
        add(Z, Y = {}) {
          let X = { ...Q5A(), ...Y };
          G?.add(Z, X);
        },
      };
    });
}
var fQ0 = !1,
  pe2;
var ne2 = T(() => {
  WLA();
  i0();
  kB();
  kB();
  bQ0();
  y7();
  me2();
  xY();
  BU();
  a2();
  i0();
  Ot1();
  iB0();
  CaA();
  ag();
  Z2A();
  A0A();
  vjA();
  F2();
  kB();
  i0();
  VR();
  ce2();
  vGA();
  ez();
  o8A();
  pe2 = I0(() => {
    JI("init_function_start");
    try {
      if (
        (RQ1(),
        JI("init_configs_enabled"),
        ge2(),
        JI("init_safe_env_vars_applied"),
        v0A.initialize(),
        JI("init_settings_detector_initialized"),
        Tr2(),
        io2(),
        oQ2(),
        !(YqA() && !fX(!0) && !K5()))
      )
        (ie2(), (fQ0 = !0));
      if (
        (JI("init_telemetry_setup"),
        bo2(),
        oHB(),
        BzB(),
        JI("init_network_configured"),
        TT0(),
        de2(),
        EqQ(),
        nY(HqQ),
        eJ())
      )
        ((process.env.CLAUDE_CODE_SESSION_ID = L0()), Z60());
      JI("init_function_end");
    } catch (A) {
      if (A instanceof XH) return ue2({ error: A });
      else throw A;
    }
  });
});
import { createHash as f4I } from "crypto";
function ae2() {
  let A = !(
    V0(process.env.CLAUDE_CODE_USE_BEDROCK) ||
    V0(process.env.CLAUDE_CODE_USE_VERTEX) ||
    process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC ||
    process.env.DISABLE_ERROR_REPORTING
  );
  Dp.init({
    dsn: FE0,
    enabled: A,
    environment: "external",
    release: {
      ISSUES_EXPLAINER:
        "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://docs.claude.com/s/claude-code",
      VERSION: "2.0.42",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    }.VERSION,
    integrations: [
      new Dp.Integrations.OnUncaughtException({
        exitEvenIfOtherHandlersAreRegistered: !1,
      }),
      new Dp.Integrations.OnUnhandledRejection({ mode: "warn" }),
      new Dp.Integrations.Http({ tracing: !0 }),
      Dp.rewriteFramesIntegration(),
    ],
    tracesSampleRate: 1,
    tracePropagationTargets: ["localhost"],
    beforeSend(B) {
      try {
        let Q = Iy();
        if (Q.userID) {
          let I = f4I("sha256").update(Q.userID).digest("hex");
          B.user = { id: I };
        }
      } catch {}
      try {
        B.tags = {
          ...B.tags,
          terminal: O0.terminal,
          userType: "external",
          ...uo2(),
        };
      } catch {}
      try {
        B.extra = { ...B.extra, sessionId: L0() };
      } catch {}
      return B;
    },
  });
}
var Dp;
var se2 = T(() => {
  U2A();
  C6();
  f4();
  i0();
  vB();
  Dp = IA(m_1(), 1);
});
import { join as re2 } from "path";
function g4I() {
  return `IMPORTANT: This message and these instructions are NOT part of the actual user conversation. Do NOT include any references to "note-taking", "session notes extraction", or these update instructions in the notes content.

Based on the user conversation above (EXCLUDING this note-taking instruction message as well as system prompt, claude.md entries, or any past session summaries), update the session notes file.

The file {{notesPath}} has already been read for you. Here are its current contents:
<current_notes_content>
{{currentNotes}}
</current_notes_content>

Your ONLY task is to use the Edit tool to update the notes file, then stop. You can make multiple edits (update every section as needed) - make all Edit tool calls in parallel in a single message. Do not call any other tools.

CRITICAL RULES FOR EDITING:
- The file must maintain its exact structure with all sections, headers, and italic descriptions intact
-- NEVER modify, delete, or add section headers (the lines starting with '##' like ## Task specification)
-- NEVER modify or delete the italic _section description_ lines (these are the lines in italics immediately following each header - they start and end with underscores)
-- The italic _section descriptions_ are TEMPLATE INSTRUCTIONS that must be preserved exactly as-is - they guide what content belongs in each section
-- ONLY update the actual content that appears BELOW the italic _section descriptions_ within each existing section
-- Do NOT add any new sections, summaries, or information outside the existing structure
- Do NOT reference this note-taking process or instructions anywhere in the notes
- It's OK to skip updating a section if there are no substantial new insights to add. Do not add filler content like "No info yet", just leave sections blank/unedited if appropriate.
- Write DETAILED, INFO-DENSE content for each section - include specifics like file paths, function names, error messages, exact commands, technical details, etc.
- Do not include information that's already in the CLAUDE.md files included in the context
- Keep each section under ~${oe2} tokens/words - if a section is approaching this limit, condense it by cycling out less important details while preserving the most critical information
- Do not repeat information from past session summaries - only use the current user conversation starting with the first non system-reminder user message.
- Focus on actionable, specific information that would help someone understand or recreate the work discussed in the conversation

Use the Edit tool with file_path: {{notesPath}}

STRUCTURE PRESERVATION REMINDER:
Each section has TWO parts that must be preserved exactly as they appear in the current file:
1. The section header (line starting with #)
2. The italic description line (the _italicized text_ immediately after the header - this is a template instruction)

You ONLY update the actual content that comes AFTER these two preserved lines. The italic description lines starting and ending with underscores are part of the template structure, NOT content to be edited or removed.

REMEMBER: Use the Edit tool in parallel and stop. Do not continue after the edits. Only include insights from the actual user conversation, never from these note-taking instructions. Do not delete or change section headers or italic _section descriptions_.`;
}
async function te2() {
  let A = NA(),
    B = re2(mB(), "session-memory", "config", "template.md");
  if (A.existsSync(B))
    try {
      return A.readFileSync(B, { encoding: "utf-8" });
    } catch (Q) {
      BA(
        Q instanceof Error
          ? Q
          : Error(`Failed to load custom session memory template: ${Q}`),
        QJ0,
      );
    }
  return h4I;
}
async function u4I() {
  let A = NA(),
    B = re2(mB(), "session-memory", "config", "prompt.md");
  if (A.existsSync(B))
    try {
      return A.readFileSync(B, { encoding: "utf-8" });
    } catch (Q) {
      BA(
        Q instanceof Error
          ? Q
          : Error(`Failed to load custom session memory prompt: ${Q}`),
        BJ0,
      );
    }
  return g4I();
}
function m4I(A) {
  let B = {},
    Q = A.split(`
`),
    I = "",
    G = [];
  for (let Z of Q)
    if (Z.startsWith("# ")) {
      if (I && G.length > 0) {
        let Y = G.join(
          `
`,
        ).trim();
        B[I] = i7(Y);
      }
      ((I = Z), (G = []));
    } else G.push(Z);
  if (I && G.length > 0) {
    let Z = G.join(
      `
`,
    ).trim();
    B[I] = i7(Z);
  }
  return B;
}
function d4I(A) {
  let B = Object.entries(A)
    .filter(([Q, I]) => I > oe2)
    .map(
      ([Q, I]) =>
        `- The "${Q}" section is currently ~${I} tokens and growing long. Consider condensing it a bit while keeping all important details.`,
    );
  if (B.length === 0) return "";
  return (
    `

` +
    B.join(`
`)
  );
}
function c4I(A, B) {
  let Q = A;
  for (let [I, G] of Object.entries(B))
    Q = Q.replace(new RegExp(`\\{\\{${I}\\}\\}`, "g"), G);
  return Q;
}
async function ee2(A, B) {
  let Q = await u4I(),
    I = m4I(A),
    G = d4I(I);
  return c4I(Q, { currentNotes: A, notesPath: B }) + G;
}
var oe2 = 2000,
  h4I = `
# Session Title
_A short and distinctive 5-10 word descriptive title for the session. Super info dense, no filler_

# Task specification
_What did the user ask to build? Any design decisions or other explanatory context_

# Files and Functions
_What are the important files? In short, what do they contain and why are they relevant?_

# Workflow
_What bash commands are usually run and in what order? How to interpret their output if not obvious?_

# User Corrections / Mistakes
_What did the user correct Assistant about? What did not work and should not be tried again?_

# Codebase and System Documentation
_What are the important system components? How do they work/fit together?_

# Learnings
_What has worked well? What has not? What to avoid? Do not duplicate items from other sections_

# Worklog
_Step by step, what was attempted, done? Very terse summary for each step_
`;
var AA9 = T(() => {
  m0();
  vB();
  c1();
  HN();
});
import { join as QA9 } from "path";
function l4I(A, B) {
  let Q = 0,
    I = B === null || B === void 0;
  for (let G of A) {
    if (!I) {
      if (G.uuid === B) I = !0;
      continue;
    }
    if (G.type === "assistant") {
      let Y = G.message.content;
      if (Array.isArray(Y)) Q += Y.filter((J) => J.type === "tool_use").length;
    }
  }
  return Q;
}
function i4I(A) {
  let B = l4I(A, BA9);
  if (!wQ1(A) || B >= p4I) {
    let I = A[A.length - 1];
    if (I?.uuid) BA9 = I.uuid;
    return !0;
  }
  return !1;
}
async function n4I(A) {
  let B = NA();
  if (!B.existsSync(hQ0)) B.mkdirSync(hQ0);
  let Q = L0(),
    I = QA9(hQ0, `${Q}.md`);
  if (!B.existsSync(I)) {
    let J = await te2();
    B.writeFileSync(I, J, { encoding: "utf-8", flush: !1, mode: 384 });
  }
  let G = await t4.call({ file_path: I }, A),
    Z = "",
    Y = G.data;
  if (Y.type === "text") Z = Y.file.content;
  return { memoryPath: I, currentMemory: Z };
}
function a4I() {
  return {
    agentType: "session-memory",
    whenToUse: "Extract and update session memory",
    tools: [g5],
    systemPrompt: "",
    model: V0(process.env.USE_HAIKU_SESSION_MEMORY) ? "haiku" : "sonnet",
    source: "built-in",
  };
}
async function IA9() {}
var hQ0,
  p4I = 5,
  BA9,
  SqG;
var GA9 = T(() => {
  i0();
  vB();
  m0();
  Ww();
  AA9();
  j01();
  IHA();
  f4();
  zN();
  iB();
  hQ0 = QA9(mB(), "session-memory");
  SqG = vP(async function (A) {
    let {
      messages: B,
      systemPrompt: Q,
      userContext: I,
      systemContext: G,
      toolUseContext: Z,
      querySource: Y,
    } = A;
    if (Y !== "repl_main_thread") return;
    if (!i4I(B)) return;
    let J = zs(Z.readFileState),
      X = { ...Z, readFileState: J },
      { memoryPath: W, currentMemory: F } = await n4I(X),
      C = await ee2(F, W),
      V = async (K, D) => {
        if (
          K.name === g5 &&
          typeof D === "object" &&
          D !== null &&
          "file_path" in D
        ) {
          let E = D.file_path;
          if (typeof E === "string" && E.includes("session-memory"))
            return { behavior: "allow", updatedInput: D };
        }
        return {
          behavior: "deny",
          message: `only ${g5} is allowed`,
          decisionReason: { type: "other", reason: `only ${g5} is allowed` },
        };
      };
    for await (let K of H7A({
      agentDefinition: a4I(),
      promptMessages: [T0({ content: C })],
      toolUseContext: X,
      canUseTool: V,
      isAsync: !0,
      forkContextMessages: B,
      querySource: "session_memory",
      override: { systemPrompt: Q, userContext: I, systemContext: G },
    }));
  });
});
import { join as s4I } from "path";
function r4I() {
  return `IMPORTANT: This message and these instructions are NOT part of the actual user conversation. Do NOT include any references to "documentation updates", "magic docs", or these update instructions in the document content.

Based on the user conversation above (EXCLUDING this documentation update instruction message), update the Magic Doc file to incorporate any NEW learnings, insights, or information that would be valuable to preserve.

The file {{docPath}} has already been read for you. Here are its current contents:
<current_doc_content>
{{docContents}}
</current_doc_content>

Document title: {{docTitle}}
{{customInstructions}}

Your ONLY task is to use the Edit tool to update the documentation file if there is substantial new information to add, then stop. You can make multiple edits (update multiple sections as needed) - make all Edit tool calls in parallel in a single message. If there's nothing substantial to add, simply respond with a brief explanation and do not call any tools.

CRITICAL RULES FOR EDITING:
- Preserve the Magic Doc header exactly as-is: # MAGIC DOC: {{docTitle}}
- If there's an italicized line immediately after the header, preserve it exactly as-is
- Keep the document CURRENT with the latest state of the codebase - this is NOT a changelog or history
- Update information IN-PLACE to reflect the current state - do NOT append historical notes or track changes over time
- Remove or replace outdated information rather than adding "Previously..." or "Updated to..." notes
- Clean up or DELETE sections that are no longer relevant or don't align with the document's purpose
- Fix obvious errors: typos, grammar mistakes, broken formatting, incorrect information, or confusing statements
- Keep the document well organized: use clear headings, logical section order, consistent formatting, and proper nesting

DOCUMENTATION PHILOSOPHY - READ CAREFULLY:
- BE TERSE. High signal only. No filler words or unnecessary elaboration.
- Documentation is for OVERVIEWS, ARCHITECTURE, and ENTRY POINTS - not detailed code walkthroughs
- Do NOT duplicate information that's already obvious from reading the source code
- Do NOT document every function, parameter, or line number reference
- Focus on: WHY things exist, HOW components connect, WHERE to start reading, WHAT patterns are used
- Skip: detailed implementation steps, exhaustive API docs, play-by-play narratives

What TO document:
- High-level architecture and system design
- Non-obvious patterns, conventions, or gotchas
- Key entry points and where to start reading code
- Important design decisions and their rationale
- Critical dependencies or integration points
- References to related files, docs, or code (like a wiki) - help readers navigate to relevant context

What NOT to document:
- Anything obvious from reading the code itself
- Exhaustive lists of files, functions, or parameters
- Step-by-step implementation details
- Low-level code mechanics
- Information already in CLAUDE.md or other project docs

Use the Edit tool with file_path: {{docPath}}

REMEMBER: Only update if there is substantial new information. The Magic Doc header (# MAGIC DOC: {{docTitle}}) must remain unchanged.`;
}
async function o4I() {
  let A = NA(),
    B = s4I(mB(), "magic-docs", "prompt.md");
  if (A.existsSync(B))
    try {
      return A.readFileSync(B, { encoding: "utf-8" });
    } catch {}
  return r4I();
}
function t4I(A, B) {
  let Q = A;
  for (let [I, G] of Object.entries(B))
    Q = Q.replace(new RegExp(`\\{\\{${I}\\}\\}`, "g"), G);
  return Q;
}
async function ZA9(A, B, Q, I) {
  let G = await o4I(),
    Z = I
      ? `

DOCUMENT-SPECIFIC UPDATE INSTRUCTIONS:
The document author has provided specific instructions for how this file should be updated. Pay extra attention to these instructions and follow them carefully:

"${I}"

These instructions take priority over the general rules below. Make sure your updates align with these specific guidelines.`
      : "";
  return t4I(G, {
    docContents: A,
    docPath: B,
    docTitle: Q,
    customInstructions: Z,
  });
}
var YA9 = T(() => {
  m0();
  vB();
});
function B8I(A) {
  let B = A.match(e4I);
  if (!B || !B[1]) return null;
  let Q = B[1].trim(),
    I = B.index + B[0].length,
    Z = A.slice(I).match(/^\s*\n(?:\s*\n)?(.+?)(?:\n|$)/);
  if (Z && Z[1]) {
    let J = Z[1].match(A8I);
    if (J && J[1]) {
      let X = J[1].trim();
      return { title: Q, instructions: X };
    }
  }
  return { title: Q };
}
function Q8I() {
  return {
    agentType: "magic-docs",
    whenToUse: "Update Magic Docs",
    tools: [g5],
    systemPrompt: "",
    model: "sonnet",
    source: "built-in",
  };
}
async function I8I(A, B) {
  let {
      messages: Q,
      systemPrompt: I,
      userContext: G,
      systemContext: Z,
      toolUseContext: Y,
    } = B,
    J = zs(Y.readFileState),
    X = { ...Y, readFileState: J };
  if (!NA().existsSync(A.path)) {
    A21.delete(A.path);
    return;
  }
  let F = await t4.call({ file_path: A.path }, X),
    C = "",
    V = F.data;
  if (V.type === "text") C = V.file.content;
  let K = B8I(C);
  if (!K) {
    A21.delete(A.path);
    return;
  }
  let D = await ZA9(C, A.path, K.title, K.instructions),
    E = async (H, w) => {
      if (
        H.name === g5 &&
        typeof w === "object" &&
        w !== null &&
        "file_path" in w
      ) {
        let L = w.file_path;
        if (typeof L === "string" && L === A.path)
          return { behavior: "allow", updatedInput: w };
      }
      return {
        behavior: "deny",
        message: `only ${g5} is allowed for ${A.path}`,
        decisionReason: { type: "other", reason: `only ${g5} is allowed` },
      };
    };
  for await (let H of H7A({
    agentDefinition: Q8I(),
    promptMessages: [T0({ content: D })],
    toolUseContext: X,
    canUseTool: E,
    isAsync: !0,
    forkContextMessages: Q,
    querySource: "magic_docs",
    override: { systemPrompt: I, userContext: G, systemContext: Z },
  }));
}
async function JA9() {}
var e4I, A8I, A21, aqG;
var XA9 = T(() => {
  m0();
  Ww();
  YA9();
  j01();
  IHA();
  zN();
  iB();
  Ww();
  ((e4I = /^#\s*MAGIC\s+DOC:\s*(.+)$/im),
    (A8I = /^[_*](.+?)[_*]\s*$/m),
    (A21 = new Map()));
  aqG = vP(async function (A) {
    let { messages: B, querySource: Q } = A;
    if (Q !== "repl_main_thread") return;
    if (wQ1(B)) return;
    if (A21.size === 0) return;
    for (let Z of Array.from(A21.values())) await I8I(Z, A);
  });
});
function WA9(A) {
  let B = [];
  for (let Q of A)
    if (Q.type === "user" && Q.message?.content) {
      let I = "";
      if (typeof Q.message.content === "string") I = Q.message.content;
      else if (Array.isArray(Q.message.content)) {
        for (let G of Q.message.content)
          if (G.type === "text") I += G.text + " ";
      }
      if (I.trim()) B.push(I.trim().slice(0, G8I));
    }
  return B;
}
function Z8I(A) {
  return A.map(
    (Q) => `User: ${Q}
Asst: [response hidden]`,
  ).join(`
`);
}
function Y8I(A) {
  let B = g2(A, "frustrated"),
    Q = g2(A, "pr_request");
  return { isFrustrated: B === "true", hasPRRequest: Q === "true" };
}
async function FA9() {
  return;
}
var G8I = 300,
  J8I;
var CA9 = T(() => {
  _m1();
  IHA();
  iB();
  Y9();
  H0();
  iB();
  J8I = {
    name: "session_quality_classifier",
    async shouldRun(A) {
      if (A.querySource !== "repl_main_thread") return !1;
      return WA9(A.messages).length > 0;
    },
    buildMessages(A) {
      let B = WA9(A.messages),
        Q = Z8I(B);
      return [
        T0({
          content: `Analyze the following conversation between a user and an assistant (assistant responses are hidden).

${Q}

Think step-by-step about:
1. Does the user seem frustrated at the Asst based on their messages? Look for signs like repeated corrections, negative language, etc.
2. Has the user explicitly asked to SEND/CREATE/PUSH a pull request to GitHub? This means they want to actually submit a PR to a repository, not just work on code together or prepare changes. Look for explicit requests like: "create a pr", "send a pull request", "push a pr", "open a pr", "submit a pr to github", etc. Do NOT count mentions of working on a PR together, preparing for a PR, or discussing PR content.

Based on your analysis, output:
<frustrated>true/false</frustrated>
<pr_request>true/false</pr_request>`,
        }),
      ];
    },
    systemPrompt:
      "You are analyzing user messages from a conversation to detect certain features of the interaction.",
    useTools: !1,
    parseResponse(A) {
      return Y8I(A);
    },
    logResult(A, B) {
      if (A.type === "success") {
        let Q = A.result;
        if (Q.isFrustrated || Q.hasPRRequest)
          GA("tengu_session_quality_classification", {
            uuid: A.uuid,
            isFrustrated: Q.isFrustrated ? 1 : 0,
            hasPRRequest: Q.hasPRRequest ? 1 : 0,
            messageCount: B.queryMessageCount,
          });
      }
    },
    getModel: FW,
  };
});
function VA9({ isFocused: A, isSelected: B, children: Q }) {
  return TqA.default.createElement(
    S,
    { gap: 1, paddingLeft: A ? 0 : 2 },
    A && TqA.default.createElement(U, { color: "suggestion" }, E1.pointer),
    TqA.default.createElement(
      U,
      { color: B ? "success" : A ? "suggestion" : void 0 },
      Q,
    ),
    B && TqA.default.createElement(U, { color: "success" }, E1.tick),
  );
}
var TqA;
var KA9 = T(() => {
  nA();
  s2();
  TqA = IA(KA(), 1);
});
var B21;
var DA9 = T(() => {
  B21 = class B21 extends Map {
    first;
    last;
    constructor(A) {
      let B = [],
        Q,
        I,
        G,
        Z = 0;
      for (let Y of A) {
        let J = { ...Y, previous: G, next: void 0, index: Z };
        if (G) G.next = J;
        ((Q ||= J), (I = J), B.push([Y.value, J]), Z++, (G = J));
      }
      super(B);
      ((this.first = Q), (this.last = I));
    }
  };
});
import { isDeepStrictEqual as EA9 } from "node:util";
var tw,
  X8I = (A, B) => {
    switch (B.type) {
      case "focus-next-option": {
        if (!A.focusedValue) return A;
        let Q = A.optionMap.get(A.focusedValue);
        if (!Q) return A;
        let I = Q.next || A.optionMap.first;
        if (!I) return A;
        if (!Q.next && I === A.optionMap.first)
          return {
            ...A,
            focusedValue: I.value,
            visibleFromIndex: 0,
            visibleToIndex: A.visibleOptionCount,
          };
        if (!(I.index >= A.visibleToIndex))
          return { ...A, focusedValue: I.value };
        let Z = Math.min(A.optionMap.size, A.visibleToIndex + 1),
          Y = Z - A.visibleOptionCount;
        return {
          ...A,
          focusedValue: I.value,
          visibleFromIndex: Y,
          visibleToIndex: Z,
        };
      }
      case "focus-previous-option": {
        if (!A.focusedValue) return A;
        let Q = A.optionMap.get(A.focusedValue);
        if (!Q) return A;
        let I = Q.previous || A.optionMap.last;
        if (!I) return A;
        if (!Q.previous && I === A.optionMap.last) {
          let J = A.optionMap.size,
            X = Math.max(0, J - A.visibleOptionCount);
          return {
            ...A,
            focusedValue: I.value,
            visibleFromIndex: X,
            visibleToIndex: J,
          };
        }
        if (!(I.index <= A.visibleFromIndex))
          return { ...A, focusedValue: I.value };
        let Z = Math.max(0, A.visibleFromIndex - 1),
          Y = Z + A.visibleOptionCount;
        return {
          ...A,
          focusedValue: I.value,
          visibleFromIndex: Z,
          visibleToIndex: Y,
        };
      }
      case "toggle-focused-option": {
        if (!A.focusedValue) return A;
        if (A.value.includes(A.focusedValue)) {
          let Q = new Set(A.value);
          return (
            Q.delete(A.focusedValue),
            { ...A, previousValue: A.value, value: [...Q] }
          );
        }
        return {
          ...A,
          previousValue: A.value,
          value: [...A.value, A.focusedValue],
        };
      }
      case "reset":
        return B.state;
    }
  },
  HA9 = ({ visibleOptionCount: A, defaultValue: B, options: Q }) => {
    let I = typeof A === "number" ? Math.min(A, Q.length) : Q.length,
      G = new B21(Q),
      Z = B ?? [];
    return {
      optionMap: G,
      visibleOptionCount: I,
      focusedValue: G.first?.value,
      visibleFromIndex: 0,
      visibleToIndex: I,
      previousValue: Z,
      value: Z,
    };
  },
  zA9 = ({
    visibleOptionCount: A = 5,
    options: B,
    defaultValue: Q,
    onChange: I,
    onSubmit: G,
  }) => {
    let [Z, Y] = tw.useReducer(
        X8I,
        { visibleOptionCount: A, defaultValue: Q, options: B },
        HA9,
      ),
      [J, X] = tw.useState(B);
    if (B !== J && !EA9(B, J))
      (Y({
        type: "reset",
        state: HA9({ visibleOptionCount: A, defaultValue: Q, options: B }),
      }),
        X(B));
    let W = tw.useCallback(() => {
        Y({ type: "focus-next-option" });
      }, []),
      F = tw.useCallback(() => {
        Y({ type: "focus-previous-option" });
      }, []),
      C = tw.useCallback(() => {
        Y({ type: "toggle-focused-option" });
      }, []),
      V = tw.useCallback(() => {
        G?.(Z.value);
      }, [Z.value, G]),
      K = tw.useMemo(() => {
        return B.map((D, E) => ({ ...D, index: E })).slice(
          Z.visibleFromIndex,
          Z.visibleToIndex,
        );
      }, [B, Z.visibleFromIndex, Z.visibleToIndex]);
    return (
      tw.useEffect(() => {
        if (!EA9(Z.previousValue, Z.value)) I?.(Z.value);
      }, [Z.previousValue, Z.value, B, I]),
      {
        focusedValue: Z.focusedValue,
        visibleFromIndex: Z.visibleFromIndex,
        visibleToIndex: Z.visibleToIndex,
        value: Z.value,
        visibleOptions: K,
        focusNextOption: W,
        focusPreviousOption: F,
        toggleFocusedOption: C,
        submit: V,
      }
    );
  };
var UA9 = T(() => {
  DA9();
  tw = IA(KA(), 1);
});
var wA9 = ({ isDisabled: A = !1, state: B }) => {
  h1(
    (Q, I) => {
      if (I.downArrow) B.focusNextOption();
      if (I.upArrow) B.focusPreviousOption();
      if (Q === " ") B.toggleFocusedOption();
      if (I.return) B.submit();
    },
    { isActive: !A },
  );
};
var $A9 = T(() => {
  nA();
});
function Q21({
  isDisabled: A = !1,
  visibleOptionCount: B = 5,
  highlightText: Q,
  options: I,
  defaultValue: G,
  onChange: Z,
  onSubmit: Y,
}) {
  let J = zA9({
    visibleOptionCount: B,
    options: I,
    defaultValue: G,
    onChange: Z,
    onSubmit: Y,
  });
  return (
    wA9({ isDisabled: A, state: J }),
    n7A.default.createElement(
      S,
      { flexDirection: "column" },
      J.visibleOptions.map((X) => {
        let W = X.label;
        if (Q && X.label.includes(Q)) {
          let F = X.label.indexOf(Q);
          W = n7A.default.createElement(
            n7A.default.Fragment,
            null,
            X.label.slice(0, F),
            n7A.default.createElement(U, { bold: !0 }, Q),
            X.label.slice(F + Q.length),
          );
        }
        return n7A.default.createElement(
          VA9,
          {
            key: X.value,
            isFocused: !A && J.focusedValue === X.value,
            isSelected: J.value.includes(X.value),
          },
          W,
        );
      }),
    )
  );
}
var n7A;
var gQ0 = T(() => {
  nA();
  KA9();
  UA9();
  $A9();
  n7A = IA(KA(), 1);
});
function qA9({ servers: A, scope: B, onDone: Q }) {
  let I = Object.keys(A),
    [G, Z] = _W.useState({});
  _W.useEffect(() => {
    US().then(({ servers: C }) => Z(C));
  }, []);
  let Y = I.filter((C) => G[C] !== void 0);
  function J(C) {
    let V = 0;
    for (let K of C) {
      let D = A[K];
      if (D) {
        let E = K;
        if (G[E] !== void 0) {
          let H = 1;
          while (G[`${K}_${H}`] !== void 0) H++;
          E = `${K}_${H}`;
        }
        (qr(E, D, B), V++);
      }
    }
    F(V);
  }
  let X = IB();
  h1((C, V) => {
    if (V.escape) {
      F(0);
      return;
    }
  });
  let [W] = HQ();
  function F(C) {
    if (C > 0)
      F9(`
${OB("success", W)(`Successfully imported ${C} MCP server${C !== 1 ? "s" : ""} to ${B} config.`)}
`);
    else
      F9(`
No servers were imported.`);
    (Q(), P6());
  }
  return _W.default.createElement(
    _W.default.Fragment,
    null,
    _W.default.createElement(
      S,
      {
        flexDirection: "column",
        gap: 1,
        padding: 1,
        borderStyle: "round",
        borderColor: "success",
      },
      _W.default.createElement(
        U,
        { bold: !0, color: "success" },
        "Import MCP Servers from Claude Desktop",
      ),
      _W.default.createElement(
        U,
        null,
        "Found ",
        I.length,
        " MCP server",
        I.length !== 1 ? "s" : "",
        " in Claude Desktop.",
      ),
      Y.length > 0 &&
        _W.default.createElement(
          U,
          { color: "warning" },
          "Note: Some servers already exist with the same name. If selected, they will be imported with a numbered suffix.",
        ),
      _W.default.createElement(
        U,
        null,
        "Please select the servers you want to import:",
      ),
      _W.default.createElement(Q21, {
        options: I.map((C) => ({
          label: `${C}${Y.includes(C) ? " (already exists)" : ""}`,
          value: C,
        })),
        defaultValue: I.filter((C) => !Y.includes(C)),
        onSubmit: J,
      }),
    ),
    _W.default.createElement(
      S,
      { marginLeft: 3 },
      _W.default.createElement(
        U,
        { dimColor: !0 },
        X.pending
          ? _W.default.createElement(
              _W.default.Fragment,
              null,
              "Press ",
              X.keyName,
              " again to exit",
            )
          : _W.default.createElement(
              _W.default.Fragment,
              null,
              "Space to select · Enter to confirm · Esc to cancel",
            ),
      ),
    ),
  );
}
var _W;
var NA9 = T(() => {
  nA();
  gQ0();
  R9();
  aN();
  xY();
  _W = IA(KA(), 1);
});
import * as uQ0 from "path";
import * as LA9 from "os";
function W8I() {
  let A = EB();
  if (!jG1.includes(A))
    throw Error(
      `Unsupported platform: ${A} - Claude Desktop integration only works on macOS and WSL.`,
    );
  if (A === "macos")
    return uQ0.join(
      LA9.homedir(),
      "Library",
      "Application Support",
      "Claude",
      "claude_desktop_config.json",
    );
  let B = process.env.USERPROFILE
    ? process.env.USERPROFILE.replace(/\\/g, "/")
    : null;
  if (B) {
    let I = `/mnt/c${B.replace(/^[A-Z]:/, "")}/AppData/Roaming/Claude/claude_desktop_config.json`;
    if (NA().existsSync(I)) return I;
  }
  try {
    if (NA().existsSync("/mnt/c/Users")) {
      let I = NA().readdirSync("/mnt/c/Users");
      for (let G of I) {
        if (
          G.name === "Public" ||
          G.name === "Default" ||
          G.name === "Default User" ||
          G.name === "All Users"
        )
          continue;
        let Z = uQ0.join(
          "/mnt/c/Users",
          G.name,
          "AppData",
          "Roaming",
          "Claude",
          "claude_desktop_config.json",
        );
        if (NA().existsSync(Z)) return Z;
      }
    }
  } catch (Q) {
    BA(Q instanceof Error ? Q : Error(String(Q)), UZ0);
  }
  throw Error(
    "Could not find Claude Desktop config file in Windows. Make sure Claude Desktop is installed on Windows.",
  );
}
function MA9() {
  if (!jG1.includes(EB()))
    throw Error(
      "Unsupported platform - Claude Desktop integration only works on macOS and WSL.",
    );
  try {
    let A = W8I();
    if (!NA().existsSync(A)) return {};
    let B = NA().readFileSync(A, { encoding: "utf8" }),
      Q = b3(B);
    if (!Q || typeof Q !== "object") return {};
    let I = Q.mcpServers;
    if (!I || typeof I !== "object") return {};
    let G = {};
    for (let [Z, Y] of Object.entries(I)) {
      if (!Y || typeof Y !== "object") continue;
      let J = Ox1.safeParse(Y);
      if (J.success) G[Z] = J.data;
    }
    return G;
  } catch (A) {
    return (BA(A instanceof Error ? A : Error(String(A)), wZ0), {});
  }
}
var OA9 = T(() => {
  wC();
  c1();
  i8A();
  E5();
  m0();
});
function I21({ customApiKeyTruncated: A, onDone: B }) {
  function Q(G) {
    let Z = L1();
    switch (G) {
      case "yes": {
        (n0({
          ...Z,
          customApiKeyResponses: {
            ...Z.customApiKeyResponses,
            approved: [...(Z.customApiKeyResponses?.approved ?? []), A],
          },
        }),
          B());
        break;
      }
      case "no": {
        (n0({
          ...Z,
          customApiKeyResponses: {
            ...Z.customApiKeyResponses,
            rejected: [...(Z.customApiKeyResponses?.rejected ?? []), A],
          },
        }),
          B());
        break;
      }
    }
  }
  let I = IB();
  return GD.default.createElement(
    GD.default.Fragment,
    null,
    GD.default.createElement(
      S,
      {
        flexDirection: "column",
        gap: 1,
        padding: 1,
        borderStyle: "round",
        borderColor: "warning",
      },
      GD.default.createElement(
        U,
        { bold: !0, color: "warning" },
        "Detected a custom API key in your environment",
      ),
      GD.default.createElement(
        U,
        null,
        GD.default.createElement(U, { bold: !0 }, "ANTHROPIC_API_KEY"),
        GD.default.createElement(U, null, ": sk-ant-...", A),
      ),
      GD.default.createElement(U, null, "Do you want to use this API key?"),
      GD.default.createElement($0, {
        defaultValue: "no",
        focusValue: "no",
        options: [
          { label: "Yes", value: "yes" },
          { label: `No (${iA.bold("recommended")})`, value: "no" },
        ],
        onChange: (G) => Q(G),
        onCancel: () => Q("no"),
      }),
    ),
    GD.default.createElement(
      S,
      { marginLeft: 3 },
      GD.default.createElement(
        U,
        { dimColor: !0 },
        I.pending
          ? GD.default.createElement(
              GD.default.Fragment,
              null,
              "Press ",
              I.keyName,
              " again to exit",
            )
          : GD.default.createElement(
              GD.default.Fragment,
              null,
              "Enter to confirm ",
              E1.dot,
              " Esc to cancel",
            ),
      ),
    ),
  );
}
var GD;
var mQ0 = T(() => {
  nA();
  kB();
  R5();
  R9();
  f2();
  s2();
  GD = IA(KA(), 1);
});
async function F8I() {
  try {
    let A = [
        "https://api.anthropic.com/api/hello",
        "https://console.anthropic.com/v1/oauth/hello",
      ],
      B = async (G) => {
        try {
          let Z = await DB.get(G, { headers: { "User-Agent": sg() } });
          if (Z.status !== 200)
            return {
              success: !1,
              error: `Failed to connect to ${new URL(G).hostname}: Status ${Z.status}`,
            };
          return { success: !0 };
        } catch (Z) {
          return {
            success: !1,
            error: `Failed to connect to ${new URL(G).hostname}: ${Z instanceof Error ? Z.code || Z.message : String(Z)}`,
          };
        }
      },
      I = (await Promise.all(A.map(B))).find((G) => !G.success);
    if (I)
      GA("tengu_preflight_check_failed", {
        isConnectivityError: !1,
        hasErrorMessage: !!I.error,
      });
    return I || { success: !0 };
  } catch (A) {
    return (
      BA(A, uY0),
      GA("tengu_preflight_check_failed", { isConnectivityError: !0 }),
      {
        success: !1,
        error: `Connectivity check error: ${A instanceof Error ? A.code || A.message : String(A)}`,
      }
    );
  }
}
function RA9({ onSuccess: A }) {
  let [B, Q] = GC.useState(null),
    [I, G] = GC.useState(!0),
    Z = CtA(1000) && I;
  return (
    GC.useEffect(() => {
      async function Y() {
        let J = await F8I();
        (Q(J), G(!1));
      }
      Y();
    }, []),
    GC.useEffect(() => {
      if (B?.success) A();
      else if (B && !B.success) {
        let Y = setTimeout(() => process.exit(1), 100);
        return () => clearTimeout(Y);
      }
    }, [B, A]),
    GC.default.createElement(
      S,
      { flexDirection: "column", gap: 1, paddingLeft: 1 },
      I && Z
        ? GC.default.createElement(
            S,
            { paddingLeft: 1 },
            GC.default.createElement(E8, null),
            GC.default.createElement(U, null, "Checking connectivity..."),
          )
        : !B?.success &&
            !I &&
            GC.default.createElement(
              S,
              { flexDirection: "column", gap: 1 },
              GC.default.createElement(
                U,
                { color: "error" },
                "Unable to connect to Anthropic services",
              ),
              GC.default.createElement(U, { color: "error" }, B?.error),
              GC.default.createElement(
                S,
                { flexDirection: "column", gap: 1 },
                GC.default.createElement(
                  U,
                  null,
                  "Please check your internet connection and network settings.",
                ),
                GC.default.createElement(
                  U,
                  null,
                  "Note: Claude Code might not be available in your country. Check supported countries at",
                  " ",
                  GC.default.createElement(
                    U,
                    { color: "suggestion" },
                    "https://anthropic.com/supported-countries",
                  ),
                ),
              ),
            ),
    )
  );
}
var GC;
var TA9 = T(() => {
  nA();
  yH();
  c1();
  xX();
  Gi1();
  H0();
  _I();
  GC = IA(KA(), 1);
});
function Z21() {
  let [A] = HQ(),
    B = "Welcome to Claude Code";
  if (O0.terminal === "Apple_Terminal")
    return z0.default.createElement(C8I, {
      theme: A,
      welcomeMessage: "Welcome to Claude Code",
    });
  if (["light", "light-daltonized", "light-ansi"].includes(A))
    return z0.default.createElement(
      S,
      { width: G21 },
      z0.default.createElement(
        U,
        null,
        z0.default.createElement(
          U,
          null,
          z0.default.createElement(
            U,
            { color: "claude" },
            "Welcome to Claude Code",
            " ",
          ),
          z0.default.createElement(
            U,
            { dimColor: !0 },
            "v",
            {
              ISSUES_EXPLAINER:
                "report the issue at https://github.com/anthropics/claude-code/issues",
              PACKAGE_URL: "@anthropic-ai/claude-code",
              README_URL: "https://docs.claude.com/s/claude-code",
              VERSION: "2.0.42",
              FEEDBACK_CHANNEL:
                "https://github.com/anthropics/claude-code/issues",
            }.VERSION,
            " ",
          ),
        ),
        z0.default.createElement(
          U,
          null,
          "…………………………………………………………………………………………………………………………………………………………",
        ),
        z0.default.createElement(
          U,
          null,
          "                                                          ",
        ),
        z0.default.createElement(
          U,
          null,
          "                                                          ",
        ),
        z0.default.createElement(
          U,
          null,
          "                                                          ",
        ),
        z0.default.createElement(
          U,
          null,
          "            ░░░░░░                                        ",
        ),
        z0.default.createElement(
          U,
          null,
          "    ░░░   ░░░░░░░░░░                                      ",
        ),
        z0.default.createElement(
          U,
          null,
          "   ░░░░░░░░░░░░░░░░░░░                                    ",
        ),
        z0.default.createElement(
          U,
          null,
          "                                                          ",
        ),
        z0.default.createElement(
          U,
          null,
          z0.default.createElement(
            U,
            { dimColor: !0 },
            "                           ░░░░",
          ),
          z0.default.createElement(U, null, "                     ██    "),
        ),
        z0.default.createElement(
          U,
          null,
          z0.default.createElement(
            U,
            { dimColor: !0 },
            "                         ░░░░░░░░░░",
          ),
          z0.default.createElement(U, null, "               ██▒▒██  "),
        ),
        z0.default.createElement(
          U,
          null,
          "                                            ▒▒      ██   ▒",
        ),
        z0.default.createElement(
          U,
          null,
          "      ",
          z0.default.createElement(U, { color: "clawd_body" }, " █████████ "),
          "                         ▒▒░░▒▒      ▒ ▒▒",
        ),
        z0.default.createElement(
          U,
          null,
          "      ",
          z0.default.createElement(
            U,
            { color: "clawd_body", backgroundColor: "clawd_background" },
            "██▄█████▄██",
          ),
          "                           ▒▒         ▒▒ ",
        ),
        z0.default.createElement(
          U,
          null,
          "      ",
          z0.default.createElement(U, { color: "clawd_body" }, " █████████ "),
          "                          ░          ▒   ",
        ),
        z0.default.createElement(
          U,
          null,
          "…………………",
          z0.default.createElement(U, { color: "clawd_body" }, "█ █   █ █"),
          "……………………………………………………………………░…………………………▒…………",
        ),
      ),
    );
  return z0.default.createElement(
    S,
    { width: G21 },
    z0.default.createElement(
      U,
      null,
      z0.default.createElement(
        U,
        null,
        z0.default.createElement(
          U,
          { color: "claude" },
          "Welcome to Claude Code",
          " ",
        ),
        z0.default.createElement(
          U,
          { dimColor: !0 },
          "v",
          {
            ISSUES_EXPLAINER:
              "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://docs.claude.com/s/claude-code",
            VERSION: "2.0.42",
            FEEDBACK_CHANNEL:
              "https://github.com/anthropics/claude-code/issues",
          }.VERSION,
          " ",
        ),
      ),
      z0.default.createElement(
        U,
        null,
        "…………………………………………………………………………………………………………………………………………………………",
      ),
      z0.default.createElement(
        U,
        null,
        "                                                          ",
      ),
      z0.default.createElement(
        U,
        null,
        "     *                                       █████▓▓░     ",
      ),
      z0.default.createElement(
        U,
        null,
        "                                 *         ███▓░     ░░   ",
      ),
      z0.default.createElement(
        U,
        null,
        "            ░░░░░░                        ███▓░           ",
      ),
      z0.default.createElement(
        U,
        null,
        "    ░░░   ░░░░░░░░░░                      ███▓░           ",
      ),
      z0.default.createElement(
        U,
        null,
        z0.default.createElement(U, null, "   ░░░░░░░░░░░░░░░░░░░    "),
        z0.default.createElement(U, { bold: !0 }, "*"),
        z0.default.createElement(U, null, "                ██▓░░      ▓   "),
      ),
      z0.default.createElement(
        U,
        null,
        "                                             ░▓▓███▓▓░    ",
      ),
      z0.default.createElement(
        U,
        { dimColor: !0 },
        " *                                 ░░░░                   ",
      ),
      z0.default.createElement(
        U,
        { dimColor: !0 },
        "                                 ░░░░░░░░                 ",
      ),
      z0.default.createElement(
        U,
        { dimColor: !0 },
        "                               ░░░░░░░░░░░░░░░░           ",
      ),
      z0.default.createElement(
        U,
        null,
        "      ",
        z0.default.createElement(U, { color: "clawd_body" }, " █████████ "),
        "                                       ",
        z0.default.createElement(U, { dimColor: !0 }, "*"),
        z0.default.createElement(U, null, " "),
      ),
      z0.default.createElement(
        U,
        null,
        "      ",
        z0.default.createElement(U, { color: "clawd_body" }, "██▄█████▄██"),
        z0.default.createElement(U, null, "                        "),
        z0.default.createElement(U, { bold: !0 }, "*"),
        z0.default.createElement(U, null, "                "),
      ),
      z0.default.createElement(
        U,
        null,
        "      ",
        z0.default.createElement(U, { color: "clawd_body" }, " █████████ "),
        "     *                                   ",
      ),
      z0.default.createElement(
        U,
        null,
        "…………………",
        z0.default.createElement(U, { color: "clawd_body" }, "█ █   █ █"),
        "………………………………………………………………………………………………………………",
      ),
    ),
  );
}
function C8I({ theme: A, welcomeMessage: B }) {
  if (["light", "light-daltonized", "light-ansi"].includes(A))
    return z0.default.createElement(
      S,
      { width: G21 },
      z0.default.createElement(
        U,
        null,
        z0.default.createElement(
          U,
          null,
          z0.default.createElement(U, { color: "claude" }, B, " "),
          z0.default.createElement(
            U,
            { dimColor: !0 },
            "v",
            {
              ISSUES_EXPLAINER:
                "report the issue at https://github.com/anthropics/claude-code/issues",
              PACKAGE_URL: "@anthropic-ai/claude-code",
              README_URL: "https://docs.claude.com/s/claude-code",
              VERSION: "2.0.42",
              FEEDBACK_CHANNEL:
                "https://github.com/anthropics/claude-code/issues",
            }.VERSION,
            " ",
          ),
        ),
        z0.default.createElement(
          U,
          null,
          "…………………………………………………………………………………………………………………………………………………………",
        ),
        z0.default.createElement(
          U,
          null,
          "                                                          ",
        ),
        z0.default.createElement(
          U,
          null,
          "                                                          ",
        ),
        z0.default.createElement(
          U,
          null,
          "                                                          ",
        ),
        z0.default.createElement(
          U,
          null,
          "            ░░░░░░                                        ",
        ),
        z0.default.createElement(
          U,
          null,
          "    ░░░   ░░░░░░░░░░                                      ",
        ),
        z0.default.createElement(
          U,
          null,
          "   ░░░░░░░░░░░░░░░░░░░                                    ",
        ),
        z0.default.createElement(
          U,
          null,
          "                                                          ",
        ),
        z0.default.createElement(
          U,
          null,
          z0.default.createElement(
            U,
            { dimColor: !0 },
            "                           ░░░░",
          ),
          z0.default.createElement(U, null, "                     ██    "),
        ),
        z0.default.createElement(
          U,
          null,
          z0.default.createElement(
            U,
            { dimColor: !0 },
            "                         ░░░░░░░░░░",
          ),
          z0.default.createElement(U, null, "               ██▒▒██  "),
        ),
        z0.default.createElement(
          U,
          null,
          "                                            ▒▒      ██   ▒",
        ),
        z0.default.createElement(
          U,
          null,
          "                                          ▒▒░░▒▒      ▒ ▒▒",
        ),
        z0.default.createElement(
          U,
          null,
          "      ",
          z0.default.createElement(U, { color: "clawd_body" }, "▗"),
          z0.default.createElement(
            U,
            { color: "clawd_background", backgroundColor: "clawd_body" },
            " ",
            "▗",
            "     ",
            "▖",
            " ",
          ),
          z0.default.createElement(U, { color: "clawd_body" }, "▖"),
          "                           ▒▒         ▒▒ ",
        ),
        z0.default.createElement(
          U,
          null,
          "       ",
          z0.default.createElement(
            U,
            { backgroundColor: "clawd_body" },
            " ".repeat(9),
          ),
          "                           ░          ▒   ",
        ),
        z0.default.createElement(
          U,
          null,
          "…………………",
          z0.default.createElement(U, { backgroundColor: "clawd_body" }, " "),
          z0.default.createElement(U, null, " "),
          z0.default.createElement(U, { backgroundColor: "clawd_body" }, " "),
          z0.default.createElement(U, null, "   "),
          z0.default.createElement(U, { backgroundColor: "clawd_body" }, " "),
          z0.default.createElement(U, null, " "),
          z0.default.createElement(U, { backgroundColor: "clawd_body" }, " "),
          "……………………………………………………………………░…………………………▒…………",
        ),
      ),
    );
  return z0.default.createElement(
    S,
    { width: G21 },
    z0.default.createElement(
      U,
      null,
      z0.default.createElement(
        U,
        null,
        z0.default.createElement(U, { color: "claude" }, B, " "),
        z0.default.createElement(
          U,
          { dimColor: !0 },
          "v",
          {
            ISSUES_EXPLAINER:
              "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://docs.claude.com/s/claude-code",
            VERSION: "2.0.42",
            FEEDBACK_CHANNEL:
              "https://github.com/anthropics/claude-code/issues",
          }.VERSION,
          " ",
        ),
      ),
      z0.default.createElement(
        U,
        null,
        "…………………………………………………………………………………………………………………………………………………………",
      ),
      z0.default.createElement(
        U,
        null,
        "                                                          ",
      ),
      z0.default.createElement(
        U,
        null,
        "     *                                       █████▓▓░     ",
      ),
      z0.default.createElement(
        U,
        null,
        "                                 *         ███▓░     ░░   ",
      ),
      z0.default.createElement(
        U,
        null,
        "            ░░░░░░                        ███▓░           ",
      ),
      z0.default.createElement(
        U,
        null,
        "    ░░░   ░░░░░░░░░░                      ███▓░           ",
      ),
      z0.default.createElement(
        U,
        null,
        z0.default.createElement(U, null, "   ░░░░░░░░░░░░░░░░░░░    "),
        z0.default.createElement(U, { bold: !0 }, "*"),
        z0.default.createElement(U, null, "                ██▓░░      ▓   "),
      ),
      z0.default.createElement(
        U,
        null,
        "                                             ░▓▓███▓▓░    ",
      ),
      z0.default.createElement(
        U,
        { dimColor: !0 },
        " *                                 ░░░░                   ",
      ),
      z0.default.createElement(
        U,
        { dimColor: !0 },
        "                                 ░░░░░░░░                 ",
      ),
      z0.default.createElement(
        U,
        { dimColor: !0 },
        "                               ░░░░░░░░░░░░░░░░           ",
      ),
      z0.default.createElement(
        U,
        null,
        "                                                      ",
        z0.default.createElement(U, { dimColor: !0 }, "*"),
        z0.default.createElement(U, null, " "),
      ),
      z0.default.createElement(
        U,
        null,
        "        ",
        z0.default.createElement(U, { color: "clawd_body" }, "▗"),
        z0.default.createElement(
          U,
          { color: "clawd_background", backgroundColor: "clawd_body" },
          " ",
          "▗",
          "     ",
          "▖",
          " ",
        ),
        z0.default.createElement(U, { color: "clawd_body" }, "▖"),
        z0.default.createElement(U, null, "                       "),
        z0.default.createElement(U, { bold: !0 }, "*"),
        z0.default.createElement(U, null, "                "),
      ),
      z0.default.createElement(
        U,
        null,
        "        ",
        z0.default.createElement(
          U,
          { backgroundColor: "clawd_body" },
          " ".repeat(9),
        ),
        "      *                                   ",
      ),
      z0.default.createElement(
        U,
        null,
        "…………………",
        z0.default.createElement(U, { backgroundColor: "clawd_body" }, " "),
        z0.default.createElement(U, null, " "),
        z0.default.createElement(U, { backgroundColor: "clawd_body" }, " "),
        z0.default.createElement(U, null, "   "),
        z0.default.createElement(U, { backgroundColor: "clawd_body" }, " "),
        z0.default.createElement(U, null, " "),
        z0.default.createElement(U, { backgroundColor: "clawd_body" }, " "),
        "………………………………………………………………………………………………………………",
      ),
    ),
  );
}
var z0,
  G21 = 58;
var dQ0 = T(() => {
  nA();
  C6();
  z0 = IA(KA(), 1);
});
function PA9({ onDone: A }) {
  let [B, Q] = a4.useState(0),
    I = Sz(),
    [G, Z] = HQ();
  a4.useEffect(() => {
    GA("tengu_began_setup", { oauthEnabled: I });
  }, [I]);
  function Y() {
    if (B < K.length - 1) {
      let D = B + 1;
      (Q(D),
        GA("tengu_onboarding_step", { oauthEnabled: I, stepId: K[D]?.id }));
    } else A();
  }
  function J(D) {
    (Z(D), Y());
  }
  let X = IB();
  h1(async (D, E) => {
    let H = K[B];
    if (E.return && H && H.id === "security")
      if (B === K.length - 1) {
        A();
        return;
      } else Y();
    else if (E.escape && H?.id === "terminal-setup") Y();
  });
  let W = a4.default.createElement(g01, {
      initialTheme: G,
      onThemeSelect: J,
      showIntroText: !0,
      helpText: "To change this later, run /theme",
      hideEscToCancel: !0,
      skipExitHandling: !0,
    }),
    F = a4.default.createElement(
      S,
      { flexDirection: "column", gap: 1, paddingLeft: 1 },
      a4.default.createElement(U, { bold: !0 }, "Security notes:"),
      a4.default.createElement(
        S,
        { flexDirection: "column", width: 70 },
        a4.default.createElement(
          qJA,
          null,
          a4.default.createElement(
            qJA.Item,
            null,
            a4.default.createElement(U, null, "Claude can make mistakes"),
            a4.default.createElement(
              U,
              { dimColor: !0, wrap: "wrap" },
              "You should always review Claude's responses, especially when",
              a4.default.createElement(AF, null),
              "running code.",
              a4.default.createElement(AF, null),
            ),
          ),
          a4.default.createElement(
            qJA.Item,
            null,
            a4.default.createElement(
              U,
              null,
              "Due to prompt injection risks, only use it with code you trust",
            ),
            a4.default.createElement(
              U,
              { dimColor: !0, wrap: "wrap" },
              "For more details see:",
              a4.default.createElement(AF, null),
              a4.default.createElement(R8, {
                url: "https://code.claude.com/docs/en/security",
              }),
            ),
          ),
        ),
      ),
      a4.default.createElement(a01, null),
    ),
    C = a4.default.createElement(RA9, { onSuccess: Y }),
    V = a4.useMemo(() => {
      if (!process.env.ANTHROPIC_API_KEY) return "";
      let D = lw(process.env.ANTHROPIC_API_KEY);
      if (OQ1(D) === "new") return D;
    }, []),
    K = [];
  if (I) K.push({ id: "preflight", component: C });
  if ((K.push({ id: "theme", component: W }), I))
    K.push({
      id: "oauth",
      component: a4.default.createElement(dc, { onDone: Y }),
    });
  if (V)
    K.push({
      id: "api-key",
      component: a4.default.createElement(I21, {
        customApiKeyTruncated: V,
        onDone: Y,
      }),
    });
  if ((K.push({ id: "security", component: F }), MJA()))
    K.push({
      id: "terminal-setup",
      component: a4.default.createElement(
        S,
        { flexDirection: "column", gap: 1, paddingLeft: 1 },
        a4.default.createElement(
          U,
          { bold: !0 },
          "Use Claude Code's terminal setup?",
        ),
        a4.default.createElement(
          S,
          { flexDirection: "column", width: 70, gap: 1 },
          a4.default.createElement(
            U,
            null,
            "For the optimal coding experience, enable the recommended settings",
            a4.default.createElement(AF, null),
            "for your terminal:",
            " ",
            O0.terminal === "Apple_Terminal"
              ? "Option+Enter for newlines and visual bell"
              : "Shift+Enter for newlines",
          ),
          a4.default.createElement($0, {
            options: [
              { label: "Yes, use recommended settings", value: "install" },
              { label: "No, maybe later with /terminal-setup", value: "no" },
            ],
            onChange: (D) => {
              if (D === "install")
                kJ1(G).then(() => {
                  Y();
                });
              else Y();
            },
            onCancel: () => Y(),
          }),
          a4.default.createElement(
            U,
            { dimColor: !0 },
            X.pending
              ? a4.default.createElement(
                  a4.default.Fragment,
                  null,
                  "Press ",
                  X.keyName,
                  " again to exit",
                )
              : a4.default.createElement(
                  a4.default.Fragment,
                  null,
                  "Enter to confirm · Esc to skip",
                ),
          ),
        ),
      ),
    });
  return a4.default.createElement(
    S,
    { flexDirection: "column" },
    a4.default.createElement(
      kh,
      { items: [a4.default.createElement(Z21, { key: "welcome" })] },
      (D) => D,
    ),
    a4.default.createElement(
      S,
      { flexDirection: "column", marginTop: 1 },
      K[B]?.component,
      X.pending &&
        a4.default.createElement(
          S,
          { padding: 1 },
          a4.default.createElement(
            U,
            { dimColor: !0 },
            "Press ",
            X.keyName,
            " again to exit",
          ),
        ),
    ),
  );
}
var a4;
var jA9 = T(() => {
  nA();
  kB();
  w$A();
  RJ1();
  R9();
  $wA();
  mQ0();
  F2();
  vK();
  pA0();
  TA9();
  bA0();
  H0();
  C6();
  Z5();
  y0A();
  dQ0();
  a4 = IA(KA(), 1);
});
import { sep as cQ0 } from "path";
function pQ0(A) {
  let B = xd();
  if (A === B.HOME) return "home";
  if (A === B.DESKTOP || A.startsWith(B.DESKTOP + cQ0)) return "desktop";
  if (A === B.DOCUMENTS || A.startsWith(B.DOCUMENTS + cQ0)) return "documents";
  if (A === B.DOWNLOADS || A.startsWith(B.DOWNLOADS + cQ0)) return "downloads";
  return "other";
}
function SA9(A) {
  if (A === null || A.disableAllHooks) return !1;
  if (A.statusLine) return !0;
  if (!A.hooks) return !1;
  for (let B of Object.values(A.hooks)) if (B.length > 0) return !0;
  return !1;
}
function vA9() {
  let A = [],
    B = cQ("projectSettings");
  if (SA9(B)) A.push(".claude/settings.json");
  let Q = cQ("localSettings");
  if (SA9(Q)) A.push(".claude/settings.local.json");
  return A;
}
function yA9(A) {
  return A.some(
    (B) =>
      B.ruleBehavior === "allow" &&
      (B.ruleValue.toolName === E4 ||
        B.ruleValue.toolName.startsWith(E4 + "(")),
  );
}
function bA9() {
  let A = [],
    B = wTA("projectSettings");
  if (yA9(B)) A.push(".claude/settings.json");
  let Q = wTA("localSettings");
  if (yA9(Q)) A.push(".claude/settings.local.json");
  return A;
}
function PqA(A, B) {
  if (A.length === 0) return "";
  let Q = B === 0 ? void 0 : B;
  if (!Q || A.length <= Q) {
    if (A.length === 1) return A[0];
    if (A.length === 2) return `${A[0]} and ${A[1]}`;
    let Z = A[A.length - 1];
    return `${A.slice(0, -1).join(", ")}, and ${Z}`;
  }
  let I = A.slice(0, Q),
    G = A.length - Q;
  if (I.length === 1) return `${I[0]} and ${G} more`;
  return `${I.join(", ")}, and ${G} more`;
}
function kA9(A) {
  return !!A?.otelHeadersHelper;
}
function fA9() {
  let A = [],
    B = cQ("projectSettings");
  if (kA9(B)) A.push(".claude/settings.json");
  let Q = cQ("localSettings");
  if (kA9(Q)) A.push(".claude/settings.local.json");
  return A;
}
function _A9(A) {
  return !!A?.apiKeyHelper;
}
function hA9() {
  let A = [],
    B = cQ("projectSettings");
  if (_A9(B)) A.push(".claude/settings.json");
  let Q = cQ("localSettings");
  if (_A9(Q)) A.push(".claude/settings.local.json");
  return A;
}
function xA9(A) {
  return !!(A?.awsAuthRefresh || A?.awsCredentialExport);
}
function gA9() {
  let A = [],
    B = cQ("projectSettings");
  if (xA9(B)) A.push(".claude/settings.json");
  let Q = cQ("localSettings");
  if (xA9(Q)) A.push(".claude/settings.local.json");
  return A;
}
var uA9 = T(() => {
  Ci();
  OQ();
  SHA();
});
var mA9;
var dA9 = T(() => {
  mA9 = {
    control: {
      title: "Do you trust the files in this folder?",
      bodyText: null,
      showDetailedPermissions: !0,
      learnMoreText: "Learn more",
      yesButtonLabel: "Yes, proceed",
      noButtonLabel: "No, exit",
    },
    variant_positive_attitude: {
      title: "Ready to code here?",
      bodyText: `I'll need permission to work with your files.

This means I can:
- Read any file in this folder
- Create, edit, or delete files
- Run commands (like npm, git, tests, ls, rm)
- Use tools defined in .mcp.json`,
      showDetailedPermissions: !1,
      learnMoreText: "Learn more",
      yesButtonLabel: "Yes, continue",
      noButtonLabel: "No, exit",
    },
    variant_normalize_action: {
      title: "Accessing workspace:",
      bodyText: `Quick safety check: Is this a project you created or one you trust? (Like your own code, a well-known open source project, or work from your team). If not, take a moment to review what's in this folder first.

Claude Code'll be able to read, edit, and execute files here.`,
      showDetailedPermissions: !1,
      learnMoreText: "Security guide",
      yesButtonLabel: "Yes, I trust this folder",
      noButtonLabel: "No, exit",
    },
    variant_explicit: {
      title: "Do you want to work in this folder?",
      bodyText: `In order to work in this folder, we need your permission for Claude Code to read, edit, and execute files.

If this folder has malicious code or untrusted scripts, Claude Code could run them while trying to help.

Only continue if this is your code or a project you trust.`,
      showDetailedPermissions: !1,
      learnMoreText: "Security details",
      yesButtonLabel: "Yes, continue",
      noButtonLabel: "No, exit",
    },
  };
});
import { homedir as cA9 } from "os";
function pA9({ onDone: A, commands: B }) {
  let { servers: Q } = SX("project"),
    I = _7("trust_folder_dialog_copy", "variant", "control"),
    G = mA9[I],
    Z = Object.keys(Q).length > 0,
    Y = vA9(),
    J = Y.length > 0,
    X = bA9(),
    W = hA9(),
    F = W.length > 0,
    C = gA9(),
    V = C.length > 0,
    K = fA9(),
    D = K.length > 0,
    E = [...new Set([...Y, ...X, ...W, ...C, ...K])],
    H =
      B?.filter(
        (c) =>
          c.type === "prompt" &&
          c.source === "projectSettings" &&
          !c.isSkill &&
          c.allowedTools?.some((e) => e === E4 || e.startsWith(E4 + "(")),
      ) ?? [],
    w =
      B?.filter(
        (c) =>
          c.type === "prompt" &&
          c.source === "localSettings" &&
          c.isSkill &&
          c.allowedTools?.some((e) => e === E4 || e.startsWith(E4 + "(")),
      ) ?? [],
    L = H.length > 0,
    N = w.length > 0,
    $ = H.map((c) => c.name),
    O = w.map((c) => c.name),
    P = X.length > 0 || L || N,
    k = fX(J || P || F || V || D),
    x = [
      {
        name: "MCP servers",
        shouldShowWarning: () => Z,
        onChange: () => {
          let c = {
            enabledMcpjsonServers: Object.keys(Q),
            enableAllProjectMcpServers: !0,
          };
          B2("localSettings", c);
        },
      },
      { name: "hooks", shouldShowWarning: () => J },
      { name: "bash commands", shouldShowWarning: () => P },
      {
        name: "OpenTelemetry headers helper commands",
        shouldShowWarning: () => D,
      },
    ].filter((c) => c.shouldShowWarning()),
    n = new Set(x.map((c) => c.name)),
    m = Object.keys(Q);
  function o() {
    let c = ["files"];
    if (n.has("MCP servers")) c.push("MCP servers");
    if (n.has("hooks")) c.push("hooks");
    if (n.has("bash commands")) c.push("bash commands");
    if (n.has("OpenTelemetry headers helper commands"))
      c.push("OpenTelemetry headers helper commands");
    return PqA(c);
  }
  a6.default.useEffect(() => {
    let c = cA9() === G0();
    GA("tengu_trust_dialog_shown", {
      isHomeDir: c,
      hasMcpServers: Z,
      hasHooks: J,
      hasBashExecution: P,
      hasApiKeyHelper: F,
      hasAwsCommands: V,
      hasOtelHeadersHelper: D,
      folderType: pQ0(G0()),
      copyVariant: I,
    });
  }, [Z, J, P, F, V, D, I]);
  function l(c) {
    let e = v6();
    if (c === "exit") {
      D8(1);
      return;
    }
    let QA = cA9() === G0();
    if (
      (GA("tengu_trust_dialog_accept", {
        isHomeDir: QA,
        hasMcpServers: Z,
        hasHooks: J,
        hasBashExecution: P,
        hasApiKeyHelper: F,
        hasAwsCommands: V,
        hasOtelHeadersHelper: D,
        enableMcp: !0,
        folderType: pQ0(G0()),
        copyVariant: I,
      }),
      !QA)
    )
      uG({ ...e, hasTrustDialogAccepted: !0 });
    (x.forEach((WA) => {
      if (WA.onChange !== void 0) WA.onChange();
    }),
      A());
  }
  let y = IB();
  if (
    (h1((c, e) => {
      if (e.escape) {
        D8(0);
        return;
      }
    }),
    k)
  )
    return (setTimeout(A), null);
  return a6.default.createElement(
    yX,
    { color: "warning", titleColor: "warning", title: G.title },
    a6.default.createElement(
      S,
      { flexDirection: "column", gap: 1, paddingTop: 1 },
      a6.default.createElement(U, { bold: !0 }, NA().cwd()),
      G.bodyText !== null
        ? a6.default.createElement(U, null, G.bodyText)
        : a6.default.createElement(
            U,
            null,
            "Claude Code may read, write, or execute files contained in this directory. This can pose security risks, so only use",
            " ",
            o(),
            " from trusted sources.",
          ),
      G.showDetailedPermissions &&
        (Z || J || P || F || V || D) &&
        a6.default.createElement(
          S,
          { flexDirection: "column", gap: 1 },
          a6.default.createElement(
            U,
            { dimColor: !0 },
            "Execution allowed by:",
          ),
          Z &&
            a6.default.createElement(
              S,
              { paddingLeft: 2 },
              a6.default.createElement(
                U,
                null,
                a6.default.createElement(U, { dimColor: !0 }, "• "),
                a6.default.createElement(U, { bold: !0 }, ".mcp.json"),
                m.length > 0 &&
                  a6.default.createElement(
                    U,
                    { dimColor: !0 },
                    " ",
                    "(",
                    PqA(m, 3),
                    ")",
                  ),
              ),
            ),
          E.length > 0 &&
            a6.default.createElement(
              S,
              { paddingLeft: 2 },
              a6.default.createElement(
                U,
                null,
                a6.default.createElement(U, { dimColor: !0 }, "• "),
                a6.default.createElement(U, { bold: !0 }, E.join(", ")),
              ),
            ),
          L &&
            a6.default.createElement(
              S,
              { paddingLeft: 2 },
              a6.default.createElement(
                U,
                null,
                a6.default.createElement(U, { dimColor: !0 }, "• "),
                a6.default.createElement(U, { bold: !0 }, ".claude/commands"),
                a6.default.createElement(
                  U,
                  { dimColor: !0 },
                  " ",
                  "(",
                  PqA($, 3),
                  ")",
                ),
              ),
            ),
          N &&
            a6.default.createElement(
              S,
              { paddingLeft: 2 },
              a6.default.createElement(
                U,
                null,
                a6.default.createElement(U, { dimColor: !0 }, "• "),
                a6.default.createElement(U, { bold: !0 }, ".claude/skills"),
                a6.default.createElement(
                  U,
                  { dimColor: !0 },
                  " (",
                  PqA(O, 3),
                  ")",
                ),
              ),
            ),
        ),
      a6.default.createElement(
        U,
        { dimColor: !0 },
        G.learnMoreText,
        " (",
        " ",
        a6.default.createElement(R8, {
          url: "https://code.claude.com/docs/en/security",
        }),
        " )",
      ),
      a6.default.createElement($0, {
        options: [
          { label: G.yesButtonLabel, value: "enable_all" },
          { label: G.noButtonLabel, value: "exit" },
        ],
        onChange: (c) => l(c),
        onCancel: () => l("exit"),
      }),
      a6.default.createElement(
        U,
        { dimColor: !0 },
        y.pending
          ? a6.default.createElement(
              a6.default.Fragment,
              null,
              "Press ",
              y.keyName,
              " again to exit",
            )
          : a6.default.createElement(
              a6.default.Fragment,
              null,
              "Enter to confirm · Esc to exit",
            ),
      ),
    ),
  );
}
var a6;
var lA9 = T(() => {
  nA();
  R5();
  kB();
  aN();
  OQ();
  f4();
  H0();
  R9();
  V2();
  vK();
  m0();
  xY();
  uA9();
  dA9();
  QR();
  a6 = IA(KA(), 1);
});
var Y21;
var iA9 = T(() => {
  kB1();
  c1();
  E7();
  c1();
  xY();
  N8();
  Y21 = IA(KA(), 1);
});
function nA9({
  context: A,
  commands: B,
  initialLogs: Q,
  initialTools: I,
  mcpClients: G,
  dynamicMcpConfig: Z,
  appState: Y,
  onChangeAppState: J,
  debug: X,
  strictMcpConfig: W = !1,
  systemPrompt: F,
  appendSystemPrompt: C,
}) {
  let { rows: V } = aB(),
    [K, D] = Ot.default.useState(Q),
    E = K.filter(($) => !$.isSidechain);
  IB();
  let H = !1,
    w = Ot.default.useCallback(() => {
      Wy()
        .then(($) => {
          D($);
        })
        .catch(($) => {
          BA($, G61);
        });
    }, []);
  Ot.default.useEffect(() => {
    w();
  }, [w]);
  function L() {
    process.exit(1);
  }
  async function N($) {
    try {
      A.unmount?.();
      let O = await Xc($, void 0);
      if (!O) throw Error("Failed to load conversation");
      (await NY(),
        await I5(
          Ot.default.createElement(
            H3,
            { initialState: Y, onChangeAppState: J },
            Ot.default.createElement(E7A, {
              initialPrompt: "",
              debug: X,
              commands: B,
              initialTools: I,
              initialMessages: O.messages,
              initialCheckpoints: O.checkpoints,
              initialFileHistorySnapshots: O.fileHistorySnapshots,
              mcpClients: G,
              dynamicMcpConfig: Z,
              strictMcpConfig: W,
              systemPrompt: F,
              appendSystemPrompt: C,
            }),
          ),
          { exitOnCtrlC: !1 },
        ));
    } catch (O) {
      throw (BA(O, G61), O);
    }
  }
  return Ot.default.createElement(j$A, {
    logs: E,
    maxHeight: V,
    onCancel: L,
    onSelect: N,
    onLogsChanged: H ? w : void 0,
  });
}
var Ot;
var aA9 = T(() => {
  nA();
  P01();
  kB1();
  c1();
  E7();
  Xx();
  R9();
  c9();
  dIA();
  N8();
  Ot = IA(KA(), 1);
});
var sA9, lQ0;
var rA9 = T(() => {
  h41();
  UD();
  sA9 = IA(W81(), 1);
  lQ0 = class lQ0 extends XZA {
    constructor(A, B) {
      var Q;
      super(B);
      ((this._serverInfo = A),
        (this._capabilities =
          (Q = B === null || B === void 0 ? void 0 : B.capabilities) !== null &&
          Q !== void 0
            ? Q
            : {}),
        (this._instructions =
          B === null || B === void 0 ? void 0 : B.instructions),
        this.setRequestHandler(L41, (I) => this._oninitialize(I)),
        this.setNotificationHandler(fLA, () => {
          var I;
          return (I = this.oninitialized) === null || I === void 0
            ? void 0
            : I.call(this);
        }));
    }
    registerCapabilities(A) {
      if (this.transport)
        throw Error(
          "Cannot register capabilities after connecting to transport",
        );
      this._capabilities = dLA(this._capabilities, A);
    }
    assertCapabilityForMethod(A) {
      var B, Q, I;
      switch (A) {
        case "sampling/createMessage":
          if (
            !((B = this._clientCapabilities) === null || B === void 0
              ? void 0
              : B.sampling)
          )
            throw Error(`Client does not support sampling (required for ${A})`);
          break;
        case "elicitation/create":
          if (
            !((Q = this._clientCapabilities) === null || Q === void 0
              ? void 0
              : Q.elicitation)
          )
            throw Error(
              `Client does not support elicitation (required for ${A})`,
            );
          break;
        case "roots/list":
          if (
            !((I = this._clientCapabilities) === null || I === void 0
              ? void 0
              : I.roots)
          )
            throw Error(
              `Client does not support listing roots (required for ${A})`,
            );
          break;
        case "ping":
          break;
      }
    }
    assertNotificationCapability(A) {
      switch (A) {
        case "notifications/message":
          if (!this._capabilities.logging)
            throw Error(`Server does not support logging (required for ${A})`);
          break;
        case "notifications/resources/updated":
        case "notifications/resources/list_changed":
          if (!this._capabilities.resources)
            throw Error(
              `Server does not support notifying about resources (required for ${A})`,
            );
          break;
        case "notifications/tools/list_changed":
          if (!this._capabilities.tools)
            throw Error(
              `Server does not support notifying of tool list changes (required for ${A})`,
            );
          break;
        case "notifications/prompts/list_changed":
          if (!this._capabilities.prompts)
            throw Error(
              `Server does not support notifying of prompt list changes (required for ${A})`,
            );
          break;
        case "notifications/cancelled":
          break;
        case "notifications/progress":
          break;
      }
    }
    assertRequestHandlerCapability(A) {
      switch (A) {
        case "sampling/createMessage":
          if (!this._capabilities.sampling)
            throw Error(`Server does not support sampling (required for ${A})`);
          break;
        case "logging/setLevel":
          if (!this._capabilities.logging)
            throw Error(`Server does not support logging (required for ${A})`);
          break;
        case "prompts/get":
        case "prompts/list":
          if (!this._capabilities.prompts)
            throw Error(`Server does not support prompts (required for ${A})`);
          break;
        case "resources/list":
        case "resources/templates/list":
        case "resources/read":
          if (!this._capabilities.resources)
            throw Error(
              `Server does not support resources (required for ${A})`,
            );
          break;
        case "tools/call":
        case "tools/list":
          if (!this._capabilities.tools)
            throw Error(`Server does not support tools (required for ${A})`);
          break;
        case "ping":
        case "initialize":
          break;
      }
    }
    async _oninitialize(A) {
      let B = A.params.protocolVersion;
      return (
        (this._clientCapabilities = A.params.capabilities),
        (this._clientVersion = A.params.clientInfo),
        {
          protocolVersion: kLA.includes(B) ? B : xf,
          capabilities: this.getCapabilities(),
          serverInfo: this._serverInfo,
          ...(this._instructions && { instructions: this._instructions }),
        }
      );
    }
    getClientCapabilities() {
      return this._clientCapabilities;
    }
    getClientVersion() {
      return this._clientVersion;
    }
    getCapabilities() {
      return this._capabilities;
    }
    async ping() {
      return this.request({ method: "ping" }, zk);
    }
    async createMessage(A, B) {
      return this.request(
        { method: "sampling/createMessage", params: A },
        _41,
        B,
      );
    }
    async elicitInput(A, B) {
      let Q = await this.request(
        { method: "elicitation/create", params: A },
        x41,
        B,
      );
      if (Q.action === "accept" && Q.content)
        try {
          let I = new sA9.default(),
            G = I.compile(A.requestedSchema);
          if (!G(Q.content))
            throw new zD(
              HD.InvalidParams,
              `Elicitation response content does not match requested schema: ${I.errorsText(G.errors)}`,
            );
        } catch (I) {
          if (I instanceof zD) throw I;
          throw new zD(
            HD.InternalError,
            `Error validating elicitation response: ${I}`,
          );
        }
      return Q;
    }
    async listRoots(A, B) {
      return this.request({ method: "roots/list", params: A }, f41, B);
    }
    async sendLoggingMessage(A) {
      return this.notification({ method: "notifications/message", params: A });
    }
    async sendResourceUpdated(A) {
      return this.notification({
        method: "notifications/resources/updated",
        params: A,
      });
    }
    async sendResourceListChanged() {
      return this.notification({
        method: "notifications/resources/list_changed",
      });
    }
    async sendToolListChanged() {
      return this.notification({ method: "notifications/tools/list_changed" });
    }
    async sendPromptListChanged() {
      return this.notification({
        method: "notifications/prompts/list_changed",
      });
    }
  };
});
import oA9 from "node:process";
class iQ0 {
  constructor(A = oA9.stdin, B = oA9.stdout) {
    ((this._stdin = A),
      (this._stdout = B),
      (this._readBuffer = new FZA()),
      (this._started = !1),
      (this._ondata = (Q) => {
        (this._readBuffer.append(Q), this.processReadBuffer());
      }),
      (this._onerror = (Q) => {
        var I;
        (I = this.onerror) === null || I === void 0 || I.call(this, Q);
      }));
  }
  async start() {
    if (this._started)
      throw Error(
        "StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.",
      );
    ((this._started = !0),
      this._stdin.on("data", this._ondata),
      this._stdin.on("error", this._onerror));
  }
  processReadBuffer() {
    var A, B;
    while (!0)
      try {
        let Q = this._readBuffer.readMessage();
        if (Q === null) break;
        (A = this.onmessage) === null || A === void 0 || A.call(this, Q);
      } catch (Q) {
        (B = this.onerror) === null || B === void 0 || B.call(this, Q);
      }
  }
  async close() {
    var A;
    if (
      (this._stdin.off("data", this._ondata),
      this._stdin.off("error", this._onerror),
      this._stdin.listenerCount("data") === 0)
    )
      this._stdin.pause();
    (this._readBuffer.clear(),
      (A = this.onclose) === null || A === void 0 || A.call(this));
  }
  send(A) {
    return new Promise((B) => {
      let Q = WMA(A);
      if (this._stdout.write(Q)) B();
      else this._stdout.once("drain", B);
    });
  }
}
var tA9 = T(() => {
  $81();
});
async function A19(A, B, Q) {
  let G = _x(100);
  EN(A);
  let Z = new lQ0(
    {
      name: "claude/tengu",
      version: {
        ISSUES_EXPLAINER:
          "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://docs.claude.com/s/claude-code",
        VERSION: "2.0.42",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      }.VERSION,
    },
    { capabilities: { tools: {} } },
  );
  (Z.setRequestHandler(y41, async () => {
    let J = kM(),
      X = Yz(J);
    return {
      tools: await Promise.all(
        X.map(async (W) => {
          let F;
          if (W.outputSchema) {
            let C = Gd(W.outputSchema);
            if (
              typeof C === "object" &&
              C !== null &&
              "type" in C &&
              C.type === "object"
            )
              F = C;
          }
          return {
            ...W,
            description: await W.prompt({
              getToolPermissionContext: async () => J,
              tools: X,
              agents: [],
            }),
            inputSchema: Gd(W.inputSchema),
            outputSchema: F,
          };
        }),
      ),
    };
  }),
    Z.setRequestHandler(k41, async ({ params: { name: J, arguments: X } }) => {
      let W = kM(),
        F = Yz(W),
        C = F.find((V) => V.name === J);
      if (!C) throw Error(`Tool ${J} not found`);
      try {
        if (!C.isEnabled()) throw Error(`Tool ${J} is not enabled`);
        let V = mI(),
          K = await C.validateInput?.(X ?? {}, {
            abortController: a9(),
            options: {
              commands: eA9,
              tools: F,
              mainLoopModel: V,
              maxThinkingTokens: 0,
              mcpClients: [],
              mcpResources: {},
              isNonInteractiveSession: !0,
              hasAppendSystemPrompt: !1,
              debug: B,
              verbose: Q,
              agentDefinitions: { activeAgents: [], allAgents: [] },
            },
            getAppState: async () => tg(),
            setAppState: () => {},
            messages: [],
            setMessages: () => {},
            messageQueueManager: AR(),
            readFileState: G,
            setInProgressToolUseIDs: () => {},
            setResponseLength: () => {},
            updateFileHistoryState: () => {},
            agentId: L0(),
          });
        if (K && !K.result)
          throw Error(`Tool ${J} input is invalid: ${K.message}`);
        let D = await C.call(
          X ?? {},
          {
            abortController: a9(),
            options: {
              commands: eA9,
              tools: F,
              mainLoopModel: mI(),
              maxThinkingTokens: 0,
              mcpClients: [],
              mcpResources: {},
              isNonInteractiveSession: !0,
              hasAppendSystemPrompt: !1,
              debug: B,
              verbose: Q,
              agentDefinitions: { activeAgents: [], allAgents: [] },
            },
            getAppState: async () => tg(),
            setAppState: () => {},
            messages: [],
            setMessages: () => {},
            messageQueueManager: AR(),
            readFileState: G,
            setInProgressToolUseIDs: () => {},
            setResponseLength: () => {},
            updateFileHistoryState: () => {},
            agentId: L0(),
          },
          DL,
          CV({ content: [] }),
        );
        return {
          content: [
            {
              type: "text",
              text: typeof D === "string" ? D : JSON.stringify(D.data),
            },
          ],
        };
      } catch (V) {
        return (
          BA(V instanceof Error ? V : Error(String(V)), KY0),
          {
            isError: !0,
            content: [
              {
                type: "text",
                text:
                  (V instanceof Error ? xc1(V) : [String(V)])
                    .filter(Boolean)
                    .join(
                      `
`,
                    )
                    .trim() || "Error",
              },
            ],
          }
        );
      }
    }));
  async function Y() {
    let J = new iQ0();
    await Z.connect(J);
  }
  return await Y();
}
var eA9;
var B19 = T(() => {
  rA9();
  tA9();
  UD();
  SaA();
  f3();
  xj();
  Y9();
  c1();
  zN();
  U5A();
  i0();
  J00();
  iB();
  nO();
  vG();
  c9();
  c5A();
  eA9 = [_B1];
});
function nQ0(A, B, Q) {
  let I = "";
  if (
    (Object.keys(Q?.enabledPlugins || {}).forEach((G) => {
      if (G === A || G === B.name || G.startsWith(`${B.name}@`)) I = G;
    }),
    !I)
  )
    I = A.includes("@") ? A : B.name;
  return I;
}
function Q19(A) {
  if (A.includes("@")) {
    let B = A.split("@");
    return { name: B[0] || "", marketplace: B[1] };
  }
  return { name: A };
}
function aQ0(A, B) {
  let { name: Q, marketplace: I } = Q19(A);
  return B.find((G) => {
    if (G.name === A || G.name === Q) return !0;
    if (I && G.source) return G.name === Q && G.source.includes(`@${I}`);
    return !1;
  });
}
function sQ0(A, B, Q) {
  let G = { ...cQ("userSettings")?.enabledPlugins };
  Object.keys(G).forEach((Y) => {
    if (Y === A || Y === Q.name || Y.startsWith(`${Q.name}@`)) G[Y] = B;
  });
  let { error: Z } = B2("userSettings", { enabledPlugins: G });
  if (Z) throw Z;
  yW();
}
function J21(A, B) {
  (BA(A instanceof Error ? A : Error(String(A)), Pl),
    console.error(
      `${E1.cross} Failed to ${B}: ${A instanceof Error ? A.message : String(A)}`,
    ),
    process.exit(1));
}
async function I19(A) {
  try {
    let { name: B, marketplace: Q } = Q19(A),
      I = await PY(),
      G,
      Z;
    for (let [W] of Object.entries(I)) {
      if (Q && W !== Q) continue;
      let C = (await AV(W)).plugins.find((V) => V.name === B);
      if (C) {
        ((G = C), (Z = W));
        break;
      }
    }
    if (!G || !Z) {
      let W = Q ? `marketplace "${Q}"` : "any configured marketplace";
      throw Error(`Plugin "${B}" not found in ${W}`);
    }
    if (typeof G.source !== "string")
      (console.log(`Installing plugin "${B}" from marketplace "${Z}"...`),
        await hDA(G.source, { manifest: { name: G.name } }));
    let Y = `${G.name}@${Z}`,
      X = { ...cQ("userSettings")?.enabledPlugins, [Y]: !0 };
    (B2("userSettings", { enabledPlugins: X }),
      yW(),
      console.log(`${E1.tick} Successfully installed plugin: ${Y}`),
      GA("tengu_plugin_installed_cli", { plugin_id: Y, marketplace_name: Z }),
      process.exit(0));
  } catch (B) {
    J21(B, `install plugin "${A}"`);
  }
}
async function G19(A) {
  try {
    let { enabled: B, disabled: Q } = await Z3(),
      I = [...B, ...Q],
      G = aQ0(A, I);
    if (!G) throw Error(`Plugin "${A}" not found in installed plugins`);
    let Z = cQ("userSettings"),
      Y = nQ0(A, G, Z);
    if (Z?.enabledPlugins?.[Y] === !1)
      throw Error(`Plugin "${A}" is already uninstalled`);
    (sQ0(Y, !1, G),
      console.log(`${E1.tick} Successfully uninstalled plugin: ${G.name}`),
      GA("tengu_plugin_uninstalled_cli", { plugin_id: Y }),
      process.exit(0));
  } catch (B) {
    J21(B, `uninstall plugin "${A}"`);
  }
}
async function Z19(A) {
  try {
    let { disabled: B } = await Z3(),
      Q = aQ0(A, B);
    if (!Q) throw Error(`Plugin "${A}" not found in disabled plugins`);
    let I = cQ("userSettings"),
      G = nQ0(A, Q, I);
    (sQ0(G, !0, Q),
      console.log(`${E1.tick} Successfully enabled plugin: ${Q.name}`),
      GA("tengu_plugin_enabled_cli", { plugin_id: G }),
      process.exit(0));
  } catch (B) {
    J21(B, `enable plugin "${A}"`);
  }
}
async function Y19(A) {
  try {
    let { enabled: B } = await Z3(),
      Q = aQ0(A, B);
    if (!Q) throw Error(`Plugin "${A}" not found in enabled plugins`);
    let I = cQ("userSettings"),
      G = nQ0(A, Q, I);
    (sQ0(G, !1, Q),
      console.log(`${E1.tick} Successfully disabled plugin: ${Q.name}`),
      GA("tengu_plugin_disabled_cli", { plugin_id: G }),
      process.exit(0));
  } catch (B) {
    J21(B, `disable plugin "${A}"`);
  }
}
var J19 = T(() => {
  s2();
  c1();
  H0();
  NF();
  pD();
  OQ();
  Ht();
});
import { join as Ry } from "path";
function X21() {
  let Q = ((N0() || {}).cleanupPeriodDays ?? V8I) * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - Q);
}
function K8I(A, B) {
  return { messages: A.messages + B.messages, errors: A.errors + B.errors };
}
function D8I(A) {
  let B = A.split(".")[0].replace(
    /T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/,
    "T$1:$2:$3.$4Z",
  );
  return new Date(B);
}
function X19(A, B, Q) {
  let I = { messages: 0, errors: 0 };
  try {
    let G = NA().readdirSync(A);
    for (let Z of G)
      try {
        if (D8I(Z.name) < B)
          if ((NA().unlinkSync(Ry(A, Z.name)), Q)) I.messages++;
          else I.errors++;
      } catch (Y) {
        BA(Y, qZ0);
      }
  } catch (G) {
    if (G instanceof Error && "code" in G && G.code !== "ENOENT") BA(G, $Z0);
  }
  return I;
}
async function E8I() {
  let A = NA(),
    B = X21(),
    Q = Hy.errors(),
    I = Hy.baseLogs(),
    G = X19(Q, B, !1);
  try {
    if (A.existsSync(I)) {
      let Y = A.readdirSync(I)
        .filter((J) => J.isDirectory() && J.name.startsWith("mcp-logs-"))
        .map((J) => Ry(I, J.name));
      for (let J of Y) {
        G = K8I(G, X19(J, B, !0));
        try {
          if (A.isDirEmptySync(J)) A.rmdirSync(J);
        } catch {}
      }
    }
  } catch (Z) {
    if (Z instanceof Error && "code" in Z && Z.code !== "ENOENT") BA(Z, r81);
  }
  return G;
}
function W19(A, B, Q, I) {
  let G = { messages: 0, errors: 0 };
  if (!I.existsSync(A)) return G;
  let Y = I.readdirSync(A).filter((J) => J.isFile() && J.name.endsWith(Q));
  for (let J of Y)
    try {
      let X = Ry(A, J.name);
      if (I.statSync(X).mtime < B) (I.unlinkSync(X), G.messages++);
    } catch {
      G.errors++;
    }
  try {
    if (I.isDirEmptySync(A)) I.rmdirSync(A);
  } catch {
    G.errors++;
  }
  return G;
}
function H8I() {
  let A = X21(),
    B = { messages: 0, errors: 0 },
    Q = e$A(),
    I = NA();
  try {
    if (!I.existsSync(Q)) return B;
    let Z = I.readdirSync(Q)
      .filter((Y) => Y.isDirectory())
      .map((Y) => Ry(Q, Y.name));
    for (let Y of Z)
      try {
        let J = W19(Y, A, ".jsonl", I);
        ((B.messages += J.messages), (B.errors += J.errors));
        let X = Ry(Y, "bash-outputs");
        if (I.existsSync(X))
          try {
            let W = I.readdirSync(X);
            for (let F of W)
              if (F.isDirectory()) {
                let C = Ry(X, F.name),
                  V = W19(C, A, ".txt", I);
                ((B.messages += V.messages), (B.errors += V.errors));
              }
            if (I.isDirEmptySync(X)) I.rmdirSync(X);
          } catch {
            B.errors++;
          }
        try {
          if (I.isDirEmptySync(Y)) I.rmdirSync(Y);
        } catch {}
      } catch {
        B.errors++;
        continue;
      }
  } catch {
    B.errors++;
  }
  return B;
}
function z8I() {
  let A = X21(),
    B = { messages: 0, errors: 0 },
    Q = NA();
  try {
    let I = mB(),
      G = Ry(I, "file-history");
    if (!Q.existsSync(G)) return B;
    let Y = Q.readdirSync(G)
      .filter((J) => J.isDirectory())
      .map((J) => Ry(G, J.name));
    for (let J of Y)
      try {
        if (!Q.existsSync(J)) continue;
        if (Q.statSync(J).mtime < A)
          (Q.rmSync(J, { recursive: !0, force: !0 }), B.messages++);
      } catch {
        B.errors++;
      }
    try {
      if (Q.isDirEmptySync(G)) Q.rmdirSync(G);
    } catch {}
  } catch (I) {
    BA(I, vJ0);
  }
  return B;
}
function U8I() {
  let A = X21(),
    B = { messages: 0, errors: 0 },
    Q = NA();
  try {
    let I = mB(),
      G = Ry(I, "session-env");
    if (!Q.existsSync(G)) return B;
    let Y = Q.readdirSync(G)
      .filter((J) => J.isDirectory())
      .map((J) => Ry(G, J.name));
    for (let J of Y)
      try {
        if (!Q.existsSync(J)) continue;
        if (Q.statSync(J).mtime < A)
          (Q.rmSync(J, { recursive: !0, force: !0 }), B.messages++);
      } catch {
        B.errors++;
      }
    try {
      if (Q.isDirEmptySync(G)) Q.rmdirSync(G);
    } catch {}
  } catch (I) {
    BA(I, r81);
  }
  return B;
}
function F19() {
  setImmediate(() => {
    (E8I(), H8I(), z8I(), U8I());
  }).unref();
}
var V8I = 30;
var C19 = T(() => {
  c1();
  Z4();
  m0();
  OQ();
  E7();
  vB();
});
import { join as K19, basename as w8I } from "path";
function q8I() {
  let A = FW(),
    B = ET(A);
  if (B <= V19) return Math.floor(B * 0.8);
  return B - V19;
}
function N8I(A) {
  return bY(A)
    .map((B) => {
      if (B.type === "user") {
        if (typeof B.message.content === "string")
          return `User: ${B.message.content}`;
        else if (Array.isArray(B.message.content))
          return `User: ${B.message.content
            .filter((Q) => Q.type === "text")
            .map((Q) => (Q.type === "text" ? Q.text : ""))
            .join(
              `
`,
            )
            .trim()}`;
      } else if (B.type === "assistant") {
        let Q = hm(B);
        if (Q) return `Claude: ${NKA(Q).trim()}`;
      }
      return null;
    })
    .filter((B) => B !== null).join(`

`);
}
async function L8I(A, B) {
  if (!A.length) throw Error("Can't summarize empty conversation");
  let Q = [],
    I = 0,
    G = q8I(),
    Z = null;
  for (let C = A.length - 1; C >= 0; C--) {
    let V = A[C];
    if (!V) continue;
    let K = qF([V]),
      D = 0;
    if (Z !== null && K > 0 && K < Z) D = Z - K;
    if (I + D > G) break;
    if ((Q.unshift(V), (I += D), K > 0)) Z = K;
  }
  let Y = Q.length < A.length;
  g(
    Y
      ? `Summarizing last ${Q.length} of ${A.length} messages (~${I} tokens)`
      : `Summarizing all ${A.length} messages (~${I} tokens)`,
  );
  let J = N8I(Q),
    W = [
      `Please write a 5-10 word title for the following conversation:

${
  Y
    ? `[Last ${Q.length} of ${A.length} messages]

`
    : ""
}${J}
`,
      "Respond with the title for the conversation and nothing else.",
    ];
  return (
    await $X({
      systemPrompt: [$8I],
      userPrompt: W.join(`
`),
      enablePromptCaching: !0,
      signal: new AbortController().signal,
      options: {
        querySource: "summarize_for_resume",
        agents: [],
        isNonInteractiveSession: B,
        hasAppendSystemPrompt: !1,
        mcpTools: [],
      },
    })
  ).message.content
    .filter((C) => C.type === "text")
    .map((C) => C.text)
    .join("");
}
function M8I(A) {
  return K19(e$A(), A.replace(/[^a-zA-Z0-9]/g, "-"));
}
function O8I(A) {
  let B = NA();
  try {
    B.statSync(A);
  } catch {
    return [];
  }
  return B.readdirSync(A)
    .filter((I) => I.isFile() && I.name.endsWith(".jsonl"))
    .map((I) => K19(A, I.name))
    .sort((I, G) => {
      let Z = B.statSync(I);
      return B.statSync(G).mtime.getTime() - Z.mtime.getTime();
    });
}
function R8I(A, B) {
  let Q = [],
    I = A;
  while (I) {
    let { isSidechain: G, parentUuid: Z, ...Y } = I;
    (Q.unshift(Y), (I = I.parentUuid ? B.get(I.parentUuid) : void 0));
  }
  return Q;
}
function T8I(A) {
  let B = new Set(
    [...A.values()].map((Q) => Q.parentUuid).filter((Q) => Q !== null),
  );
  return [...A.values()].filter((Q) => !B.has(Q.uuid));
}
function P8I(A) {
  let B = NA();
  try {
    let { buffer: Q } = B.readSync(A, { length: 512 }),
      I = Q.toString("utf8"),
      G = I.indexOf(`
`);
    if (G === -1) return JSON.parse(I.trim()).type === "summary";
    let Z = I.substring(0, G);
    return JSON.parse(Z).type === "summary";
  } catch {
    return !1;
  }
}
async function D19(A) {
  if (K5()) return;
  let B = M8I(G0()),
    Q = O8I(B);
  for (let I of Q)
    try {
      if (P8I(I)) break;
      if (!Vz(w8I(I, ".jsonl"))) continue;
      let { messages: Y, summaries: J } = await qQ1(I),
        X = T8I(Y);
      for (let W of X) {
        if (J.has(W.uuid)) continue;
        let F = R8I(W, Y);
        if (F.length === 0) continue;
        try {
          let C = await L8I(F, A);
          if (C) await tr2(W.uuid, C);
        } catch (C) {
          BA(C instanceof Error ? C : Error(String(C)), EJ0);
        }
      }
    } catch (G) {
      BA(G instanceof Error ? G : Error(String(G)), HJ0);
    }
}
var $8I,
  V19 = 50000;
var E19 = T(() => {
  zG();
  iB();
  E7();
  c1();
  C0();
  m0();
  Tv();
  V2();
  DN();
  Y9();
  i0();
  $8I = `
Summarize this coding conversation in under 50 characters.
Capture the main task, key files, problems addressed, and current status.
`.trim();
});
function j8I(A, B, Q, I) {
  var G = -1,
    Z = A == null ? 0 : A.length;
  while (++G < Z) {
    var Y = A[G];
    B(I, Y, Q(Y), A);
  }
  return I;
}
var H19;
var z19 = T(() => {
  H19 = j8I;
});
function S8I(A, B, Q, I) {
  return (
    btA(A, function (G, Z, Y) {
      B(I, G, Q(G), Y);
    }),
    I
  );
}
var U19;
var w19 = T(() => {
  ui1();
  U19 = S8I;
});
function y8I(A, B) {
  return function (Q, I) {
    var G = eI(Q) ? H19 : U19,
      Z = B ? B() : {};
    return G(Q, A, DT(I, 2), Z);
  };
}
var $19;
var q19 = T(() => {
  z19();
  w19();
  Se();
  ED();
  $19 = y8I;
});
var k8I, N19;
var L19 = T(() => {
  q19();
  ((k8I = $19(
    function (A, B, Q) {
      A[Q ? 0 : 1].push(B);
    },
    function () {
      return [[], []];
    },
  )),
    (N19 = k8I));
});
function W21() {
  return rQ0.default.createElement(
    U,
    null,
    "MCP servers may execute code or access system resources. All tool calls require approval. Learn more in the",
    " ",
    rQ0.default.createElement(
      n5A,
      { url: "https://docs.claude.com/s/claude-code-mcp" },
      "MCP documentation",
    ),
    ".",
  );
}
var rQ0;
var oQ0 = T(() => {
  nA();
  NrA();
  rQ0 = IA(KA(), 1);
});
function M19({ serverNames: A, onDone: B }) {
  function Q(G) {
    let Z = N0() || {},
      Y = Z.enabledMcpjsonServers || [],
      J = Z.disabledMcpjsonServers || [],
      [X, W] = N19(A, (F) => G.includes(F));
    if (
      (GA("tengu_mcp_multidialog_choice", {
        approved: X.length,
        rejected: W.length,
      }),
      X.length > 0)
    ) {
      let F = [...new Set([...Y, ...X])];
      B2("localSettings", { enabledMcpjsonServers: F });
    }
    if (W.length > 0) {
      let F = [...new Set([...J, ...W])];
      B2("localSettings", { disabledMcpjsonServers: F });
    }
    B();
  }
  let I = IB();
  return (
    h1((G, Z) => {
      if (Z.escape) {
        let J = (N0() || {}).disabledMcpjsonServers || [],
          X = [...new Set([...J, ...A])];
        (B2("localSettings", { disabledMcpjsonServers: X }), B());
        return;
      }
    }),
    bz.default.createElement(
      bz.default.Fragment,
      null,
      bz.default.createElement(
        S,
        {
          flexDirection: "column",
          gap: 1,
          padding: 1,
          borderStyle: "round",
          borderColor: "warning",
        },
        bz.default.createElement(
          U,
          { bold: !0, color: "warning" },
          A.length,
          " new MCP servers found in .mcp.json",
        ),
        bz.default.createElement(U, null, "Select any you wish to enable."),
        bz.default.createElement(W21, null),
        bz.default.createElement(Q21, {
          options: A.map((G) => ({ label: G, value: G })),
          defaultValue: A,
          onSubmit: Q,
        }),
      ),
      bz.default.createElement(
        S,
        { marginLeft: 3 },
        bz.default.createElement(
          U,
          { dimColor: !0 },
          I.pending
            ? bz.default.createElement(
                bz.default.Fragment,
                null,
                "Press ",
                I.keyName,
                " again to exit",
              )
            : bz.default.createElement(
                bz.default.Fragment,
                null,
                "Space to select · Enter to confirm · Esc to reject all",
              ),
        ),
      ),
    )
  );
}
var bz;
var O19 = T(() => {
  nA();
  gQ0();
  OQ();
  L19();
  oQ0();
  R9();
  H0();
  bz = IA(KA(), 1);
});
function R19({ serverName: A, onDone: B }) {
  function Q(G) {
    switch ((GA("tengu_mcp_dialog_choice", { choice: G }), G)) {
      case "yes":
      case "yes_all": {
        let Y = (N0() || {}).enabledMcpjsonServers || [];
        if (!Y.includes(A))
          B2("localSettings", { enabledMcpjsonServers: [...Y, A] });
        if (G === "yes_all")
          B2("localSettings", { enableAllProjectMcpServers: !0 });
        B();
        break;
      }
      case "no": {
        let Y = (N0() || {}).disabledMcpjsonServers || [];
        if (!Y.includes(A))
          B2("localSettings", { disabledMcpjsonServers: [...Y, A] });
        B();
        break;
      }
    }
  }
  let I = IB();
  return (
    h1((G, Z) => {
      if (Z.escape) {
        B();
        return;
      }
    }),
    ew.default.createElement(
      ew.default.Fragment,
      null,
      ew.default.createElement(
        S,
        {
          flexDirection: "column",
          gap: 1,
          padding: 1,
          borderStyle: "round",
          borderColor: "warning",
        },
        ew.default.createElement(
          U,
          { bold: !0, color: "warning" },
          "New MCP server found in .mcp.json: ",
          A,
        ),
        ew.default.createElement(W21, null),
        ew.default.createElement($0, {
          options: [
            {
              label: "Use this and all future MCP servers in this project",
              value: "yes_all",
            },
            { label: "Use this MCP server", value: "yes" },
            { label: "Continue without using this MCP server", value: "no" },
          ],
          onChange: (G) => Q(G),
          onCancel: () => Q("no"),
        }),
      ),
      ew.default.createElement(
        S,
        { marginLeft: 3 },
        ew.default.createElement(
          U,
          { dimColor: !0 },
          I.pending
            ? ew.default.createElement(
                ew.default.Fragment,
                null,
                "Press ",
                I.keyName,
                " again to exit",
              )
            : ew.default.createElement(
                ew.default.Fragment,
                null,
                "Enter to confirm · Esc to reject",
              ),
        ),
      ),
    )
  );
}
var ew;
var T19 = T(() => {
  nA();
  R5();
  OQ();
  oQ0();
  R9();
  H0();
  ew = IA(KA(), 1);
});
async function P19() {
  let { servers: A } = SX("project"),
    B = Object.keys(A).filter((Q) => ErA(Q) === "pending");
  if (B.length === 0) return;
  await new Promise(async (Q) => {
    let I = () => {
      process.stdout.write("\x1B[2J\x1B[3J\x1B[H", () => {
        Q();
      });
    };
    if (B.length === 1 && B[0] !== void 0) {
      let G = await I5(
        jqA.default.createElement(
          H3,
          null,
          jqA.default.createElement(R19, {
            serverName: B[0],
            onDone: () => {
              (G.unmount?.(), I());
            },
          }),
        ),
        { exitOnCtrlC: !1 },
      );
    } else {
      let G = await I5(
        jqA.default.createElement(
          H3,
          null,
          jqA.default.createElement(M19, {
            serverNames: B,
            onDone: () => {
              (G.unmount?.(), I());
            },
          }),
        ),
        { exitOnCtrlC: !1 },
      );
    }
  });
}
var jqA;
var j19 = T(() => {
  nA();
  O19();
  T19();
  c9();
  aN();
  kF();
  jqA = IA(KA(), 1);
});
var _8I;
var S19 = T(() => {
  _8I = IA(PcA(), 1);
});
function y19({ onAccept: A }) {
  ZC.default.useEffect(() => {
    GA("tengu_bypass_permissions_mode_dialog_shown", {});
  }, []);
  function B(I) {
    let G = L1();
    switch (I) {
      case "accept": {
        (GA("tengu_bypass_permissions_mode_dialog_accept", {}),
          n0({ ...G, bypassPermissionsModeAccepted: !0 }),
          A());
        break;
      }
      case "decline": {
        D8(1);
        break;
      }
    }
  }
  let Q = IB();
  return (
    h1((I, G) => {
      if (G.escape) {
        D8(0);
        return;
      }
    }),
    ZC.default.createElement(
      ZC.default.Fragment,
      null,
      ZC.default.createElement(
        S,
        {
          flexDirection: "column",
          gap: 1,
          padding: 1,
          borderStyle: "round",
          borderColor: "error",
        },
        ZC.default.createElement(
          U,
          { bold: !0, color: "error" },
          "WARNING: Claude Code running in Bypass Permissions mode",
        ),
        ZC.default.createElement(
          S,
          { flexDirection: "column", gap: 1 },
          ZC.default.createElement(
            U,
            null,
            "In Bypass Permissions mode, Claude Code will not ask for your approval before running potentially dangerous commands.",
            ZC.default.createElement(AF, null),
            "This mode should only be used in a sandboxed container/VM that has restricted internet access and can easily be restored if damaged.",
          ),
          ZC.default.createElement(
            U,
            null,
            "By proceeding, you accept all responsibility for actions taken while running in Bypass Permissions mode.",
          ),
          ZC.default.createElement(R8, {
            url: "https://code.claude.com/docs/en/security",
          }),
        ),
        ZC.default.createElement($0, {
          options: [
            { label: "No, exit", value: "decline" },
            { label: "Yes, I accept", value: "accept" },
          ],
          onChange: (I) => B(I),
          onCancel: () => B("decline"),
        }),
      ),
      ZC.default.createElement(
        S,
        { marginLeft: 3 },
        ZC.default.createElement(
          U,
          { dimColor: !0 },
          Q.pending
            ? ZC.default.createElement(
                ZC.default.Fragment,
                null,
                "Press ",
                Q.keyName,
                " again to exit",
              )
            : ZC.default.createElement(
                ZC.default.Fragment,
                null,
                "Enter to confirm · Esc to exit",
              ),
        ),
      ),
    )
  );
}
var ZC;
var k19 = T(() => {
  nA();
  R5();
  kB();
  H0();
  R9();
  vK();
  xY();
  ZC = IA(KA(), 1);
});
function vb({ newState: A, oldState: B }) {
  if (A.mainLoopModel !== B.mainLoopModel && A.mainLoopModel === null)
    (B2("userSettings", { model: void 0 }), Xl(null));
  if (A.mainLoopModel !== B.mainLoopModel && A.mainLoopModel !== null)
    (B2("userSettings", { model: A.mainLoopModel }), Xl(A.mainLoopModel));
  if (
    A.showExpandedTodos !== B.showExpandedTodos &&
    L1().showExpandedTodos !== A.showExpandedTodos
  )
    n0({ ...L1(), showExpandedTodos: A.showExpandedTodos });
  if (B !== null && A.todos !== B.todos)
    for (let Q in A.todos) ziA(A.todos[Q], Q);
  if (A.verbose !== B.verbose && L1().verbose !== A.verbose)
    n0({ ...L1(), verbose: A.verbose });
  if (A.thinkingEnabled !== B.thinkingEnabled)
    B2("userSettings", { alwaysThinkingEnabled: A.thinkingEnabled });
  if (
    A.feedbackSurvey.timeLastShown !== B.feedbackSurvey.timeLastShown &&
    A.feedbackSurvey.timeLastShown !== null
  )
    n0({
      ...L1(),
      feedbackSurveyState: { lastShownTime: A.feedbackSurvey.timeLastShown },
    });
  if (
    eJ() &&
    (A.mcp.tools.length > 0 ||
      A.mcp.clients.length > 0 ||
      Object.keys(A.mcp.resources).length > 0 ||
      A.mcp !== B.mcp)
  )
    Y60(A.mcp.clients, A.mcp.tools, A.mcp.resources);
}
var _19 = T(() => {
  kB();
  kB();
  i0();
  OQ();
  _m();
  vGA();
  ez();
});
function x19() {
  let A = L1();
  if (A.autoUpdates !== !1 || A.autoUpdatesProtectedForNative === !0) return;
  try {
    let B = cQ("userSettings") || {};
    (B2("userSettings", { ...B, env: { ...B.env, DISABLE_AUTOUPDATER: "1" } }),
      GA("tengu_migrate_autoupdates_to_settings", {
        was_user_preference: !0,
        already_had_env_var: !!B.env?.DISABLE_AUTOUPDATER,
      }),
      (process.env.DISABLE_AUTOUPDATER = "1"));
    let { autoUpdates: Q, autoUpdatesProtectedForNative: I, ...G } = A;
    n0(G);
  } catch (B) {
    (BA(Error(`Failed to migrate auto-updates: ${B}`), qY0),
      GA("tengu_migrate_autoupdates_error", { has_error: !0 }));
  }
}
var v19 = T(() => {
  kB();
  OQ();
  H0();
  c1();
});
async function b19() {
  if (
    !(
      (await _F("force_local_installation_migration")) &&
      !Bc() &&
      !print &&
      !V0(!1) &&
      !0 &&
      !tr()
    )
  )
    return;
  g(
    "Migrating Claude CLI to local installation. This improves auto-updates and removes dependency on global npm permissions. Your existing configuration and history will be preserved.",
  );
  try {
    (GA("tengu_forced_migration_start", { gateControlled: !0 }),
      await new Promise(async (B) => {
        let { waitUntilExit: Q } = await I5(
          SqA.createElement(H3, null, SqA.createElement(R7A, null)),
        );
        Q().then(() => {
          B();
        });
      }),
      GA("tengu_forced_migration_success", { gateControlled: !0 }),
      g(
        "Migration complete! Please restart Claude CLI to use the new installation.",
      ),
      process.exit(0));
  } catch (B) {
    let Q = B instanceof Error ? B : Error(String(B));
    (BA(Q, $Y0),
      GA("tengu_forced_migration_failure", { gateControlled: !0 }),
      g(
        "Migration encountered an error, continuing with global installation.",
        { level: "error" },
      ));
  }
}
var SqA;
var f19 = T(() => {
  nA();
  DB1();
  f4();
  H0();
  c9();
  WR();
  c1();
  FR();
  vB();
  C0();
  SqA = IA(KA(), 1);
});
function h19() {
  let A = v6(),
    B = A.enableAllProjectMcpServers !== void 0,
    Q = A.enabledMcpjsonServers && A.enabledMcpjsonServers.length > 0,
    I = A.disabledMcpjsonServers && A.disabledMcpjsonServers.length > 0;
  if (!B && !Q && !I) return;
  try {
    let G = cQ("localSettings") || {},
      Z = {},
      Y = [];
    if (B && G.enableAllProjectMcpServers === void 0)
      ((Z.enableAllProjectMcpServers = A.enableAllProjectMcpServers),
        Y.push("enableAllProjectMcpServers"));
    else if (B) Y.push("enableAllProjectMcpServers");
    if (Q && A.enabledMcpjsonServers) {
      let J = G.enabledMcpjsonServers || [];
      ((Z.enabledMcpjsonServers = [
        ...new Set([...J, ...A.enabledMcpjsonServers]),
      ]),
        Y.push("enabledMcpjsonServers"));
    }
    if (I && A.disabledMcpjsonServers) {
      let J = G.disabledMcpjsonServers || [];
      ((Z.disabledMcpjsonServers = [
        ...new Set([...J, ...A.disabledMcpjsonServers]),
      ]),
        Y.push("disabledMcpjsonServers"));
    }
    if (Object.keys(Z).length > 0) B2("localSettings", Z);
    if (Y.length > 0) {
      let J = v6(),
        {
          enableAllProjectMcpServers: X,
          enabledMcpjsonServers: W,
          disabledMcpjsonServers: F,
          ...C
        } = J;
      if (
        Y.includes("enableAllProjectMcpServers") ||
        Y.includes("enabledMcpjsonServers") ||
        Y.includes("disabledMcpjsonServers")
      )
        uG(C);
    }
    GA("tengu_migrate_mcp_approval_fields_success", {
      migratedCount: Y.length,
    });
  } catch {
    GA("tengu_migrate_mcp_approval_fields_error", {});
  }
}
var g19 = T(() => {
  kB();
  OQ();
  H0();
});
import { posix as x8I } from "path";
function v8I(A) {
  let B = NQ1(A)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
  return x8I.isAbsolute(B) && !B.startsWith("//") ? "/" + B : B;
}
function u19() {
  let A = v6(),
    B = A.ignorePatterns;
  if (!B || !Array.isArray(B) || B.length === 0) return;
  let Q = [];
  for (let Z of B) {
    let Y = v8I(Z);
    Q.push(
      { toolName: "Read", ruleContent: Y },
      { toolName: "Edit", ruleContent: Y },
    );
  }
  if ($TA({ ruleValues: Q, ruleBehavior: "deny" }, "localSettings"))
    try {
      (delete A.ignorePatterns,
        uG(A),
        GA("tengu_migrate_ignore_patterns_success", {
          ignore_patterns_count: B.length,
        }));
    } catch (Z) {
      (BA(
        Error(
          `Failed to remove ignorePatterns from config: ${Z instanceof Error ? Z.message : String(Z)}`,
        ),
        OZA,
      ),
        GA("tengu_migrate_ignore_patterns_config_cleanup_error", {
          ignore_patterns_count: B.length,
        }));
    }
  else
    (BA(Error("Failed to migrate ignorePatterns to settings permissions"), OZA),
      GA("tengu_migrate_ignore_patterns_error", {
        ignore_patterns_count: B.length,
      }));
}
var m19 = T(() => {
  kB();
  H0();
  c1();
  KJ();
  Ci();
});
function d19() {
  if (L1().sonnet45MigrationComplete) return;
  if (g3() !== "firstParty") {
    n0({ ...L1(), sonnet45MigrationComplete: !0 });
    return;
  }
  if (N0()?.model !== void 0)
    (B2("userSettings", { model: void 0 }),
      n0({
        ...L1(),
        sonnet45MigrationComplete: !0,
        sonnet45MigrationTimestamp: Date.now(),
      }));
  else n0({ ...L1(), sonnet45MigrationComplete: !0 });
}
var c19 = T(() => {
  kB();
  OQ();
  EH();
});
function yqA(A, B, Q, I) {
  let G = {
    type: "permissionPromptTool",
    permissionPromptToolName: B.name,
    toolResult: A,
  };
  if (A.behavior === "allow") {
    let Z = A.updatedPermissions;
    if (Z)
      (I.setAppState((Y) => ({
        ...Y,
        toolPermissionContext: so(Y.toolPermissionContext, Z),
      })),
        n11(Z));
    return { ...A, decisionReason: G };
  } else if (A.behavior === "deny" && A.interrupt)
    I.abortController.abort("tool-rejection");
  return { ...A, decisionReason: G };
}
var iRG, b8I, f8I, F21;
var tQ0 = T(() => {
  e2();
  aC();
  ((iRG = PQ.object({
    tool_name: PQ.string().describe(
      "The name of the tool requesting permission",
    ),
    input: PQ.record(PQ.unknown()).describe("The input for the tool"),
    tool_use_id: PQ.string()
      .optional()
      .describe("The unique tool use request ID"),
  })),
    (b8I = PQ.object({
      behavior: PQ.literal("allow"),
      updatedInput: PQ.record(PQ.unknown()),
      updatedPermissions: PQ.array(Yo2).optional(),
    })),
    (f8I = PQ.object({
      behavior: PQ.literal("deny"),
      message: PQ.string(),
      interrupt: PQ.boolean().optional(),
    })),
    (F21 = PQ.union([b8I, f8I])));
});
import { randomUUID as h8I } from "crypto";
class kqA {
  input;
  structuredInput;
  pendingRequests = new Map();
  inputClosed = !1;
  constructor(A) {
    this.input = A;
    ((this.input = A), (this.structuredInput = this.read()));
  }
  async *read() {
    let A = "";
    for await (let B of this.input) {
      A += B;
      let Q;
      while (
        (Q = A.indexOf(`
`)) !== -1
      ) {
        let I = A.slice(0, Q);
        A = A.slice(Q + 1);
        let G = this.processLine(I);
        if (G) yield G;
      }
    }
    if (A) {
      let B = this.processLine(A);
      if (B) yield B;
    }
    this.inputClosed = !0;
    for (let B of this.pendingRequests.values())
      B.reject(Error("Tool permission stream closed before response received"));
  }
  getPendingPermissionRequests() {
    return this.pendingRequests
      .values()
      .map((A) => A.request)
      .filter((A) => A.request.subtype === "can_use_tool")
      .toArray();
  }
  processLine(A) {
    try {
      let B = JSON.parse(A);
      if (B.type === "keep_alive") return;
      if (B.type === "control_response") {
        let Q = this.pendingRequests.get(B.response.request_id);
        if (!Q) return;
        if (
          (this.pendingRequests.delete(B.response.request_id),
          B.response.subtype === "error")
        ) {
          Q.reject(Error(B.response.error));
          return;
        }
        let I = B.response.response;
        if (Q.schema)
          try {
            Q.resolve(Q.schema.parse(I));
          } catch (G) {
            Q.reject(G);
          }
        else Q.resolve({});
        return;
      }
      if (B.type !== "user" && B.type !== "control_request")
        eQ0(
          `Error: Expected message type 'user' or 'control', got '${B.type}'`,
        );
      if (B.type === "control_request") {
        if (!B.request) eQ0("Error: Missing request on control_request");
        return B;
      }
      if (B.message.role !== "user")
        eQ0(`Error: Expected message role 'user', got '${B.message.role}'`);
      return B;
    } catch (B) {
      (console.error(`Error parsing streaming input line: ${A}: ${B}`),
        process.exit(1));
    }
  }
  write(A) {
    F9(
      JSON.stringify(A) +
        `
`,
    );
  }
  async sendRequest(A, B, Q) {
    let I = h8I(),
      G = { type: "control_request", request_id: I, request: A };
    if (this.inputClosed) throw Error("Stream closed");
    if (Q?.aborted) throw Error("Request aborted");
    this.write(G);
    let Z = () => {
      this.write({ type: "control_cancel_request", request_id: I });
      let Y = this.pendingRequests.get(I);
      if (Y) Y.reject(new IX());
    };
    if (Q) Q.addEventListener("abort", Z, { once: !0 });
    try {
      return await new Promise((Y, J) => {
        this.pendingRequests.set(I, {
          request: { type: "control_request", request_id: I, request: A },
          resolve: (X) => {
            Y(X);
          },
          reject: J,
          schema: B,
        });
      });
    } finally {
      if (Q) Q.removeEventListener("abort", Z);
      this.pendingRequests.delete(I);
    }
  }
  createCanUseTool() {
    return async (A, B, Q, I, G) => {
      let Z = await DL(A, B, Q, I, G);
      if (Z.behavior === "allow" || Z.behavior === "deny") return Z;
      try {
        let Y = await this.sendRequest(
          {
            subtype: "can_use_tool",
            tool_name: A.name,
            input: B,
            permission_suggestions: Z.suggestions,
            tool_use_id: G,
          },
          F21,
          Q.abortController.signal,
        );
        return yqA(Y, A, B, Q);
      } catch (Y) {
        return yqA(
          { behavior: "deny", message: `Tool permission request failed: ${Y}` },
          A,
          B,
          Q,
        );
      }
    };
  }
  createHookCallback(A, B) {
    return {
      type: "callback",
      timeout: B,
      callback: async (Q, I, G) => {
        try {
          return await this.sendRequest(
            {
              subtype: "hook_callback",
              callback_id: A,
              input: Q,
              tool_use_id: I || void 0,
            },
            DQ1,
            G,
          );
        } catch (Z) {
          return (console.error(`Error in hook callback ${A}:`, Z), {});
        }
      },
    };
  }
  async sendMcpMessage(A, B) {
    return (
      await this.sendRequest(
        { subtype: "mcp_message", server_name: A, message: B },
        _.object({ mcp_response: _.any() }),
      )
    ).mcp_response;
  }
}
function eQ0(A) {
  (console.error(A), process.exit(1));
}
var A20 = T(() => {
  f3();
  e2();
  tQ0();
  EB0();
  y7();
});
class B20 {
  ws = null;
  lastSentId = null;
  url;
  state = "idle";
  onData;
  onCloseCallback;
  headers;
  reconnectAttempts = 0;
  reconnectTimer = null;
  pingInterval = null;
  messageBuffer;
  constructor(A, B = {}) {
    ((this.url = A), (this.headers = B), (this.messageBuffer = new XJA(g8I)));
  }
  connect() {
    if (this.state !== "idle" && this.state !== "reconnecting") {
      g(`WebSocketTransport: Cannot connect, current state is ${this.state}`, {
        level: "error",
      });
      return;
    }
    ((this.state = "reconnecting"),
      g(`WebSocketTransport: Opening ${this.url.href}`));
    let A = { ...this.headers };
    if (this.lastSentId)
      ((A["X-Last-Request-Id"] = this.lastSentId),
        g(
          `WebSocketTransport: Adding X-Last-Request-Id header: ${this.lastSentId}`,
        ));
    ((this.ws = new zT(this.url.href, {
      headers: A,
      agent: DFA(this.url.href),
    })),
      this.ws.on("open", () => {
        g("WebSocketTransport: Connected");
        let B = this.ws.upgradeReq;
        if (B?.headers?.["x-last-request-id"]) {
          let Q = B.headers["x-last-request-id"];
          this.replayBufferedMessages(Q);
        }
        ((this.reconnectAttempts = 0),
          (this.state = "connected"),
          this.startPingInterval());
      }),
      this.ws.on("message", (B) => {
        let Q = B.toString();
        if (this.onData) this.onData(Q);
      }),
      this.ws.on("error", (B) => {
        (g(`WebSocketTransport: Error: ${B.message}`, { level: "error" }),
          this.handleConnectionError());
      }),
      this.ws.on("close", (B, Q) => {
        (g(`WebSocketTransport: Closed: ${B}`, { level: "error" }),
          this.handleConnectionError());
      }));
  }
  sendLine(A) {
    if (!this.ws || this.state !== "connected")
      return (g("WebSocketTransport: Not connected"), !1);
    try {
      return (this.ws.send(A), !0);
    } catch (B) {
      return (
        g(`WebSocketTransport: Failed to send: ${B}`, { level: "error" }),
        (this.ws = null),
        this.handleConnectionError(),
        !1
      );
    }
  }
  doDisconnect() {
    if ((this.stopPingInterval(), this.ws)) (this.ws.close(), (this.ws = null));
  }
  handleConnectionError() {
    if (
      (g(`WebSocketTransport: Disconnected from ${this.url.href}`),
      this.doDisconnect(),
      this.state === "closing" || this.state === "closed")
    )
      return;
    if (this.reconnectAttempts < p19) {
      if (this.reconnectTimer)
        (clearTimeout(this.reconnectTimer), (this.reconnectTimer = null));
      ((this.state = "reconnecting"), this.reconnectAttempts++);
      let A = Math.min(u8I * Math.pow(2, this.reconnectAttempts - 1), m8I);
      (g(
        `WebSocketTransport: Reconnecting in ${A}ms (attempt ${this.reconnectAttempts}/${p19})`,
      ),
        (this.reconnectTimer = setTimeout(() => {
          ((this.reconnectTimer = null), this.connect());
        }, A)));
    } else if (
      (g(
        `WebSocketTransport: Max reconnection attempts reached for ${this.url.href}`,
        { level: "error" },
      ),
      (this.state = "closed"),
      this.onCloseCallback)
    )
      this.onCloseCallback();
  }
  close() {
    if (this.reconnectTimer)
      (clearTimeout(this.reconnectTimer), (this.reconnectTimer = null));
    (this.stopPingInterval(), (this.state = "closing"), this.doDisconnect());
  }
  replayBufferedMessages(A) {
    let B = this.messageBuffer.toArray();
    if (B.length === 0) return;
    let Q = 0;
    if (A) {
      let G = B.findIndex((Z) => "uuid" in Z && Z.uuid === A);
      if (G >= 0) Q = G + 1;
    }
    let I = B.slice(Q);
    if (I.length === 0) {
      g("WebSocketTransport: No new messages to replay");
      return;
    }
    g(`WebSocketTransport: Replaying ${I.length} buffered messages`);
    for (let G of I) {
      let Z =
        JSON.stringify(G) +
        `
`;
      if (!this.sendLine(Z)) {
        this.handleConnectionError();
        break;
      }
    }
  }
  isConnectedStatus() {
    return this.state === "connected";
  }
  setOnData(A) {
    this.onData = A;
  }
  setOnClose(A) {
    this.onCloseCallback = A;
  }
  write(A) {
    if ("uuid" in A && typeof A.uuid === "string")
      (this.messageBuffer.add(A), (this.lastSentId = A.uuid));
    let B =
      JSON.stringify(A) +
      `
`;
    if (this.state !== "connected") return;
    this.sendLine(B);
  }
  startPingInterval() {
    (this.stopPingInterval(),
      (this.pingInterval = setInterval(() => {
        if (this.state === "connected" && this.ws)
          try {
            this.ws.ping();
          } catch (A) {
            g(`WebSocketTransport: Ping failed: ${A}`, { level: "error" });
          }
      }, d8I)));
  }
  stopPingInterval() {
    if (this.pingInterval)
      (clearInterval(this.pingInterval), (this.pingInterval = null));
  }
}
var g8I = 1000,
  p19 = 3,
  u8I = 1000,
  m8I = 30000,
  d8I = 1e4;
var l19 = T(() => {
  nGA();
  C0();
  ag();
});
function i19(A, B = {}) {
  if (A.protocol === "ws:" || A.protocol === "wss:") return new B20(A, B);
  else throw Error(`Unsupported protocol: ${A.protocol}`);
}
var n19 = T(() => {
  l19();
});
import { URL as c8I } from "url";
import { PassThrough as p8I } from "stream";
var Q20;
var a19 = T(() => {
  A20();
  n19();
  BU();
  g11();
  Q20 = class Q20 extends kqA {
    url;
    transport;
    inputStream;
    constructor(A, B) {
      let Q = new p8I({ encoding: "utf8" });
      super(Q);
      ((this.inputStream = Q), (this.url = new c8I(A)));
      let I = {},
        G = io();
      if (G) I.Authorization = `Bearer ${G}`;
      if (
        ((this.transport = i19(this.url, I)),
        this.transport.setOnData((Z) => {
          this.inputStream.write(Z);
        }),
        this.transport.setOnClose(() => {
          this.inputStream.end();
        }),
        this.transport.connect(),
        nY(async () => this.close()),
        B)
      ) {
        let Z = this.inputStream;
        (async () => {
          for await (let Y of B)
            Z.write(
              Y +
                `
`,
            );
        })();
      }
    }
    write(A) {
      this.transport.write(A);
    }
    close() {
      (this.transport.close(), this.inputStream.end());
    }
  };
});
import { randomUUID as Rt } from "node:crypto";
function i8I(A) {
  if (!A) return !1;
  if (A.type === "assistant") {
    let B = nV(A.message.content);
    return (
      B?.type === "text" ||
      B?.type === "thinking" ||
      B?.type === "redacted_thinking"
    );
  }
  if (A.type === "user") {
    let B = A.message.content;
    if (!Array.isArray(B) || B.length === 0) return !1;
    return B.every((Q) => "type" in Q && Q.type === "tool_result");
  }
  return !1;
}
async function* r19({
  commands: A,
  prompt: B,
  promptUuid: Q,
  cwd: I,
  tools: G,
  mcpClients: Z,
  verbose: Y = !1,
  maxThinkingTokens: J,
  maxTurns: X,
  maxBudgetUsd: W,
  canUseTool: F,
  mutableMessages: C = [],
  customSystemPrompt: V,
  appendSystemPrompt: K,
  userSpecifiedModel: D,
  fallbackModel: E,
  getAppState: H,
  setAppState: w,
  messageQueueManager: L,
  abortController: N,
  replayUserMessages: $ = !1,
  includePartialMessages: O = !1,
  agents: P = [],
  setSDKStatus: k,
}) {
  EN(I);
  let b = Date.now(),
    x = [],
    n = async (G1, e1, _0, h0, a0, c0) => {
      let K0 = await F(G1, e1, _0, h0, a0, c0);
      if (K0.behavior !== "allow") {
        let F1 = { tool_name: G1.name, tool_use_id: a0, tool_input: e1 };
        x.push(F1);
      }
      return K0;
    },
    m = await H(),
    o = D ? _U(D) : mI(),
    [l, y, c] = await Promise.all([
      Dd(
        G,
        o,
        Array.from(m.toolPermissionContext.additionalWorkingDirectories.keys()),
        Z,
        m.toolPermissionContext,
      ),
      FV(),
      typeof V === "string" ? Promise.resolve({}) : WV(),
    ]),
    e = [...(typeof V === "string" ? [V] : l), ...(K ? [K] : [])],
    QA = typeof K === "string",
    WA = {
      messages: C,
      setMessages: () => {},
      onChangeAPIKey: () => {},
      options: {
        commands: A,
        debug: !1,
        tools: G,
        verbose: Y,
        mainLoopModel: o,
        maxThinkingTokens: J ?? 0,
        mcpClients: Z,
        mcpResources: {},
        ideInstallationStatus: null,
        isNonInteractiveSession: !0,
        hasAppendSystemPrompt: QA,
        agentDefinitions: { activeAgents: P, allAgents: [] },
        theme: L1().theme,
        maxBudgetUsd: W,
      },
      getAppState: H,
      setAppState: w,
      messageQueueManager: L,
      abortController: N ?? a9(),
      readFileState: s19(C, I),
      setInProgressToolUseIDs: () => {},
      setResponseLength: () => {},
      updateFileHistoryState: () => {},
      agentId: L0(),
      setSDKStatus: k,
    },
    {
      messages: JA,
      shouldQuery: wA,
      allowedTools: xA,
      maxThinkingTokens: rA,
      model: qA,
    } = await Db({
      input: B,
      mode: "prompt",
      setIsLoading: () => {},
      setToolJSX: () => {},
      context: { ...WA, messages: C },
      messages: C,
      uuid: Q,
      querySource: "sdk",
    });
  C.push(...JA);
  let SA = J ?? rA ?? 0,
    zA = [...C],
    kA = JA.filter(
      (G1) =>
        (G1.type === "user" && !G1.isMeta && !G1.toolUseResult) ||
        (G1.type === "system" && G1.subtype === "compact_boundary"),
    ),
    sA = $ ? kA : [];
  w((G1) => ({
    ...G1,
    toolPermissionContext: {
      ...G1.toolPermissionContext,
      alwaysAllowRules: {
        ...G1.toolPermissionContext.alwaysAllowRules,
        command: xA,
      },
    },
  }));
  let Z1 = qA ?? o,
    XA = s19(zA, I),
    CA = qqQ(XA, WA.readFileState);
  WA = {
    messages: zA,
    setMessages: () => {},
    onChangeAPIKey: () => {},
    options: {
      commands: A,
      debug: !1,
      tools: G,
      verbose: Y,
      mainLoopModel: Z1,
      maxThinkingTokens: SA,
      mcpClients: Z,
      mcpResources: {},
      ideInstallationStatus: null,
      isNonInteractiveSession: !0,
      hasAppendSystemPrompt: QA,
      theme: L1().theme,
      agentDefinitions: { activeAgents: P, allAgents: [] },
      maxBudgetUsd: W,
    },
    getAppState: H,
    setAppState: w,
    abortController: N || a9(),
    readFileState: CA,
    messageQueueManager: WA.messageQueueManager,
    setInProgressToolUseIDs: () => {},
    setResponseLength: () => {},
    updateFileHistoryState: () => {},
    agentId: L0(),
    setSDKStatus: k,
  };
  let HA = N0()?.outputStyle ?? nF,
    [LA, { enabled: TA }] = await Promise.all([oaA(), Z3()]);
  if (
    (yield {
      type: "system",
      subtype: "init",
      cwd: I,
      session_id: L0(),
      tools: G.map((G1) => G1.name),
      mcp_servers: Z.map((G1) => ({ name: G1.name, status: G1.type })),
      model: Z1,
      permissionMode: m.toolPermissionContext.mode,
      slash_commands: A.map((G1) => G1.name),
      apiKeySource: Bw().source,
      claude_code_version: {
        ISSUES_EXPLAINER:
          "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://docs.claude.com/s/claude-code",
        VERSION: "2.0.42",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      }.VERSION,
      output_style: HA,
      agents: P.map((G1) => G1.agentType),
      skills: LA.map((G1) => G1.name),
      plugins: TA.map((G1) => ({ name: G1.name, path: G1.path })),
      uuid: Rt(),
    },
    !wA)
  ) {
    for (let G1 of kA) {
      if (
        G1.type === "user" &&
        typeof G1.message.content === "string" &&
        (G1.message.content.includes("<local-command-stdout>") ||
          G1.message.content.includes("<local-command-stderr>") ||
          G1.isCompactSummary)
      )
        (zA.push(G1),
          yield {
            type: "user",
            message: { ...G1.message, content: SZ(G1.message.content) },
            session_id: L0(),
            parent_tool_use_id: null,
            uuid: G1.uuid,
            isReplay: !G1.isCompactSummary,
          });
      if (G1.type === "system" && G1.subtype === "compact_boundary")
        (zA.push(G1),
          yield {
            type: "system",
            subtype: "compact_boundary",
            session_id: L0(),
            uuid: G1.uuid,
            compact_metadata: {
              trigger: G1.compactMetadata.trigger,
              pre_tokens: G1.compactMetadata.preTokens,
            },
          });
    }
    (await tHA(zA),
      yield {
        type: "result",
        subtype: "success",
        is_error: !1,
        duration_ms: Date.now() - b,
        duration_api_ms: IM(),
        num_turns: zA.length - 1,
        result: "",
        session_id: L0(),
        total_cost_usd: dV(),
        usage: $y,
        modelUsage: {},
        permission_denials: x,
        uuid: Rt(),
      });
    return;
  }
  let tA = $y,
    aA = $y,
    W1 = 1,
    w1 = !1;
  for await (let G1 of wS({
    messages: zA,
    systemPrompt: e,
    userContext: y,
    systemContext: c,
    canUseTool: n,
    toolUseContext: WA,
    fallbackModel: E,
    querySource: "sdk",
  })) {
    if (
      G1.type === "assistant" ||
      G1.type === "user" ||
      (G1.type === "system" && G1.subtype === "compact_boundary")
    ) {
      if ((zA.push(G1), await tHA(zA), !w1 && sA.length > 0)) {
        w1 = !0;
        for (let e1 of sA)
          if (e1.type === "user")
            yield {
              type: "user",
              message: e1.message,
              session_id: L0(),
              parent_tool_use_id: null,
              uuid: e1.uuid,
              isReplay: !0,
            };
      }
    }
    if (G1.type === "user") W1++;
    switch (G1.type) {
      case "assistant":
      case "progress":
      case "user":
        (C.push(G1), yield* a8I(G1));
        break;
      case "stream_event":
        if (G1.event.type === "message_start")
          ((aA = $y), (aA = c$A(aA, G1.event.message.usage)));
        if (G1.event.type === "message_delta") aA = c$A(aA, G1.event.usage);
        if (G1.event.type === "message_stop") tA = os2(tA, aA);
        if (O)
          yield {
            type: "stream_event",
            event: G1.event,
            session_id: L0(),
            parent_tool_use_id: null,
            uuid: Rt(),
          };
        break;
      case "attachment":
        if ((C.push(G1), GLQ(G1.attachment)))
          yield {
            type: "system",
            subtype: "hook_response",
            session_id: L0(),
            uuid: G1.uuid,
            hook_name: G1.attachment.hookName,
            hook_event: G1.attachment.hookEvent,
            stdout: G1.attachment.stdout,
            stderr: G1.attachment.stderr,
            exit_code: G1.attachment.exitCode,
          };
        else if (piA(G1.attachment))
          yield {
            type: "system",
            subtype: "hook_response",
            session_id: L0(),
            uuid: G1.uuid,
            hook_name: G1.attachment.hookName,
            hook_event: G1.attachment.hookEvent,
            stdout: G1.attachment.stdout || "",
            stderr: G1.attachment.stderr || "",
            exit_code: G1.attachment.exitCode,
          };
        else if ($ && ciA(G1)) {
          let e1 = G1.attachment;
          if (e1.type === "queued_command")
            yield {
              type: "user",
              message: {
                role: "user",
                content: typeof e1.prompt === "string" ? e1.prompt : e1.prompt,
              },
              session_id: L0(),
              parent_tool_use_id: null,
              uuid: e1.source_uuid || G1.uuid,
              isReplay: !0,
            };
        }
        break;
      case "stream_request_start":
        break;
      case "system":
        if (
          (C.push(G1), G1.subtype === "compact_boundary" && G1.compactMetadata)
        )
          yield {
            type: "system",
            subtype: "compact_boundary",
            session_id: L0(),
            uuid: G1.uuid,
            compact_metadata: {
              trigger: G1.compactMetadata.trigger,
              pre_tokens: G1.compactMetadata.preTokens,
            },
          };
        break;
    }
    if (G1.type === "user" && X && W1 >= X) {
      yield {
        type: "result",
        subtype: "error_max_turns",
        duration_ms: Date.now() - b,
        duration_api_ms: IM(),
        is_error: !1,
        num_turns: W1,
        session_id: L0(),
        total_cost_usd: dV(),
        usage: tA,
        modelUsage: Jl(),
        permission_denials: x,
        uuid: Rt(),
        errors: [],
      };
      return;
    }
    if (W !== void 0 && dV() >= W) {
      yield {
        type: "result",
        subtype: "error_max_budget_usd",
        duration_ms: Date.now() - b,
        duration_api_ms: IM(),
        is_error: !1,
        num_turns: W1,
        session_id: L0(),
        total_cost_usd: dV(),
        usage: tA,
        modelUsage: Jl(),
        permission_denials: x,
        uuid: Rt(),
        errors: [],
      };
      return;
    }
  }
  let OA = nV(zA);
  if (!i8I(OA)) {
    yield {
      type: "result",
      subtype: "error_during_execution",
      duration_ms: Date.now() - b,
      duration_api_ms: IM(),
      is_error: !1,
      num_turns: W1,
      session_id: L0(),
      total_cost_usd: dV(),
      usage: tA,
      modelUsage: Jl(),
      permission_denials: x,
      uuid: Rt(),
      errors: _4A().map((G1) => G1.error),
    };
    return;
  }
  let I1 = "",
    i1 = !1;
  if (OA.type === "assistant") {
    let G1 = nV(OA.message.content);
    if (G1?.type === "text") I1 = G1.text;
    i1 = Boolean(OA.isApiErrorMessage);
  }
  yield {
    type: "result",
    subtype: "success",
    is_error: i1,
    duration_ms: Date.now() - b,
    duration_api_ms: IM(),
    num_turns: W1,
    result: I1,
    session_id: L0(),
    total_cost_usd: dV(),
    usage: tA,
    modelUsage: Jl(),
    permission_denials: x,
    uuid: Rt(),
  };
}
function* a8I(A) {
  switch (A.type) {
    case "assistant":
      for (let B of bY([A]))
        yield {
          type: "assistant",
          message: B.message,
          parent_tool_use_id: null,
          session_id: L0(),
          uuid: B.uuid,
        };
      return;
    case "progress":
      if (A.data.type === "agent_progress")
        for (let B of bY([A.data.message]))
          switch (B.type) {
            case "assistant":
              yield {
                type: "assistant",
                message: B.message,
                parent_tool_use_id: A.parentToolUseID,
                session_id: L0(),
                uuid: B.uuid,
              };
              break;
            case "user":
              yield {
                type: "user",
                message: B.message,
                parent_tool_use_id: A.parentToolUseID,
                session_id: L0(),
                uuid: B.uuid,
                isSynthetic: B.isMeta || B.isVisibleInTranscriptOnly,
              };
              break;
          }
      else if (A.data.type === "bash_progress") {
        if (
          !process.env.CLAUDE_CODE_REMOTE &&
          !process.env.CLAUDE_CODE_CONTAINER_ID
        )
          break;
        let B = A.parentToolUseID,
          Q = Date.now(),
          I = _qA.get(B) || 0;
        if (Q - I >= 60000) {
          if (_qA.size >= n8I) {
            let Z = _qA.keys().next().value;
            if (Z !== void 0) _qA.delete(Z);
          }
          (_qA.set(B, Q),
            yield {
              type: "tool_progress",
              tool_use_id: A.toolUseID,
              tool_name: "Bash",
              parent_tool_use_id: A.parentToolUseID,
              elapsed_time_seconds: A.data.elapsedTimeSeconds,
              session_id: L0(),
              uuid: A.uuid,
            });
        }
      }
      break;
    case "user":
      for (let B of bY([A]))
        yield {
          type: "user",
          message: B.message,
          parent_tool_use_id: null,
          session_id: L0(),
          uuid: B.uuid,
          isSynthetic: B.isMeta || B.isVisibleInTranscriptOnly,
        };
      return;
    default:
  }
}
function s19(A, B) {
  let Q = _x(l8I),
    I = new Map(),
    G = new Map();
  for (let Z of A)
    if (Z.type === "assistant" && Array.isArray(Z.message.content)) {
      for (let Y of Z.message.content)
        if (Y.type === "tool_use" && Y.name === z3) {
          let J = Y.input;
          if (J?.file_path && J?.offset === void 0 && J?.limit === void 0) {
            let X = M9(J.file_path, B);
            I.set(Y.id, X);
          }
        } else if (Y.type === "tool_use" && Y.name === WF) {
          let J = Y.input;
          if (J?.file_path && J?.content) {
            let X = M9(J.file_path, B);
            G.set(Y.id, { filePath: X, content: J.content });
          }
        }
    }
  for (let Z of A)
    if (Z.type === "user" && Array.isArray(Z.message.content)) {
      for (let Y of Z.message.content)
        if (Y.type === "tool_result" && Y.tool_use_id) {
          let J = I.get(Y.tool_use_id);
          if (J && typeof Y.content === "string") {
            let C = Y.content
              .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
              .split(
                `
`,
              )
              .map((V) => {
                let K = V.match(/^\s*\d+→(.*)$/);
                return K ? K[1] : V;
              })
              .join(
                `
`,
              )
              .trim();
            if (Z.timestamp) {
              let V = new Date(Z.timestamp).getTime();
              Q.set(J, {
                content: C,
                timestamp: V,
                offset: void 0,
                limit: void 0,
              });
            }
          }
          let X = G.get(Y.tool_use_id);
          if (X && Z.timestamp) {
            let W = new Date(Z.timestamp).getTime();
            Q.set(X.filePath, {
              content: X.content,
              timestamp: W,
              offset: void 0,
              limit: void 0,
            });
          }
        }
    }
  return Q;
}
var l8I = 10,
  n8I = 100,
  _qA;
var o19 = T(() => {
  Q0A();
  Gz();
  Qr();
  ZS();
  ux();
  U5A();
  zN();
  WK();
  R_();
  xj();
  hG();
  E7();
  iB();
  mwA();
  i0();
  Y9();
  PM();
  F2();
  uj();
  FQ1();
  zG();
  kB();
  vG();
  Gy();
  OQ();
  NF();
  c1();
  _qA = new Map();
});
function t19(A) {
  let B = process.env.CLAUDE_CODE_EXIT_AFTER_STOP_DELAY,
    Q = B ? parseInt(B, 10) : null,
    I = Q && !isNaN(Q) && Q > 0,
    G = null,
    Z = 0;
  return {
    start() {
      if (G) (clearTimeout(G), (G = null));
      if (I)
        ((Z = Date.now()),
          (G = setTimeout(() => {
            let Y = Date.now() - Z;
            if (A() && Y >= Q) (g(`Exiting after ${Q}ms of idle time`), D8());
          }, Q)));
    },
    stop() {
      if (G) (clearTimeout(G), (G = null));
    },
  };
}
var e19 = T(() => {
  C0();
  xY();
});
import { randomUUID as A09 } from "crypto";
function B09(A) {
  try {
    let B = new URL(A);
    return {
      sessionId: A09(),
      ingressUrl: B.href,
      isUrl: !0,
      jsonlFile: null,
      isJsonlFile: !1,
    };
  } catch {
    if (Vz(A))
      return {
        sessionId: A,
        ingressUrl: null,
        isUrl: !1,
        jsonlFile: null,
        isJsonlFile: !1,
      };
    if (A.endsWith(".jsonl"))
      return {
        sessionId: A09(),
        ingressUrl: null,
        isUrl: !1,
        jsonlFile: A,
        isJsonlFile: !0,
      };
  }
  return null;
}
var Q09 = T(() => {
  Tv();
});
function I09(A) {
  let B = A.find((Q) => Q.name === "claude-vscode");
  if (B && B.type === "connected") {
    (g("[VSCode MCP] Setup notification handlers"),
      B.client.setNotificationHandler(s8I, async (I) => {
        let { eventName: G, eventData: Z } = I.params;
        (g(`[VSCode MCP] Received VSCode log_event: ${G}`),
          GA(`tengu_vscode_${G}`, Z));
      }));
    let Q = { test: !0 };
    (B.client.notification({
      method: "experiment_gates",
      params: { gates: Q },
    }),
      g(`[VSCode MCP] Experiments enabled: ${JSON.stringify(Q)}`));
  }
}
var s8I;
var G09 = T(() => {
  e2();
  C0();
  H0();
  s8I = _.object({
    method: _.literal("log_event"),
    params: _.object({
      eventName: _.string(),
      eventData: _.object({}).passthrough(),
    }),
  });
});
import { cwd as r8I } from "process";
import { randomUUID as C21 } from "crypto";
async function Y09(A, B, Q, I, G, Z, Y, J) {
  if (await lIA()) await Ti2();
  if (VQ.isSandboxingEnabled())
    try {
      await VQ.initialize();
    } catch (L) {
      (process.stderr.write(`
❌ Sandbox Error: ${L instanceof Error ? L.message : String(L)}
`),
        D8(1, "other"));
      return;
    }
  if (J.resumeSessionAt && !J.resume) {
    (process.stderr.write(`Error: --resume-session-at requires --resume
`),
      D8(1));
    return;
  }
  let X = await B(),
    W = await Q6I({
      continue: J.continue,
      teleport: J.teleport,
      resume: J.resume,
      resumeSessionAt: J.resumeSessionAt,
      forkSession: J.forkSession,
    }),
    F =
      typeof J.resume === "string" &&
      (Boolean(Vz(J.resume)) || J.resume.endsWith(".jsonl")),
    C = Boolean(J.sdkUrl);
  if (!A && !F && !C) {
    (process.stderr
      .write(`Error: Input must be provided either through stdin or as a prompt argument when using --print
`),
      D8(1));
    return;
  }
  if (J.outputFormat === "stream-json" && !J.verbose) {
    (process.stderr
      .write(`Error: When using --print, --output-format=stream-json requires --verbose
`),
      D8(1));
    return;
  }
  let V = eJ() ? G : [...G, ...X.mcp.tools],
    K = I6I(A, J),
    D = J.sdkUrl ? "stdio" : J.permissionPromptToolName,
    E = e8I(D, K, X.mcp.tools);
  if (J.permissionPromptToolName)
    V = V.filter((L) => L.name !== J.permissionPromptToolName);
  let H = [];
  for await (let L of o8I(
    K,
    X.mcp.clients,
    [...I, ...X.mcp.commands],
    V,
    W,
    E,
    Z,
    B,
    Q,
    Y,
    J,
  )) {
    if (J.outputFormat === "stream-json" && J.verbose) K.write(L);
    if (
      L.type !== "control_response" &&
      L.type !== "control_request" &&
      L.type !== "control_cancel_request" &&
      L.type !== "stream_event" &&
      L.type !== "keep_alive"
    )
      H.push(L);
  }
  let w = nV(H);
  switch (J.outputFormat) {
    case "json":
      if (!w || w.type !== "result") throw Error("No messages returned");
      if (J.verbose) {
        F9(
          JSON.stringify(H) +
            `
`,
        );
        break;
      }
      F9(
        JSON.stringify(w) +
          `
`,
      );
      break;
    case "stream-json":
      break;
    default:
      if (!w || w.type !== "result") throw Error("No messages returned");
      switch (w.subtype) {
        case "success":
          F9(
            w.result.endsWith(`
`)
              ? w.result
              : w.result +
                  `
`,
          );
          break;
        case "error_during_execution":
          F9("Execution error");
          break;
        case "error_max_turns":
          F9(`Error: Reached max turns (${J.maxTurns})`);
          break;
        case "error_max_budget_usd":
          F9(`Error: Exceeded USD budget (${J.maxBudgetUsd})`);
      }
  }
  D8(w?.type === "result" && w?.is_error ? 1 : 0);
}
function o8I(A, B, Q, I, G, Z, Y, J, X, W, F) {
  let C = AR(),
    V = !1,
    K = !1,
    D,
    E = new bHA();
  if (F.enableAuthStatus)
    nK.getInstance().subscribe((y) => {
      E.enqueue({
        type: "auth_status",
        isAuthenticating: y.isAuthenticating,
        output: y.output,
        error: y.error,
        uuid: C21(),
        session_id: L0(),
      });
    });
  let H = hT2(G),
    w = [],
    L = !1,
    N = G;
  for (let l of H)
    if (
      l.type === "system" &&
      l.subtype === "hook_response" &&
      l.hook_event === "SessionStart"
    )
      w.push(l);
  let O = IbA().map((l) => {
      return {
        value: l.value === null ? "default" : l.value,
        displayName: l.label,
        description: l.description,
      };
    }),
    P = F.userSpecifiedModel,
    k = [],
    b = [];
  async function x() {
    let l = new Set(Object.keys(Y)),
      y = new Set(k.map((WA) => WA.name)),
      c = Array.from(l).some((WA) => !y.has(WA)),
      e = Array.from(y).some((WA) => !l.has(WA));
    if (c || e) {
      for (let JA of k)
        if (!l.has(JA.name)) {
          if (JA.type === "connected") await JA.cleanup();
        }
      let WA = await Oe2(Y, (JA, wA) => A.sendMcpMessage(JA, wA));
      ((k = WA.clients), (b = WA.tools), I09(k));
    }
  }
  x();
  let n = t19(() => !V),
    m = async () => {
      if (((V = !0), n.stop(), !L)) {
        L = !0;
        for (let c of w) E.enqueue(c);
      }
      await x();
      let l = [...B, ...k],
        y = [...I, ...b];
      try {
        while (!C.isEmpty()) {
          let c = C.dequeue();
          if (c.mode !== "prompt")
            throw Error("only prompt commands are supported in streaming mode");
          let e = c.value;
          D = a9();
          for await (let QA of r19({
            commands: Q,
            prompt: e,
            promptUuid: c.uuid,
            cwd: r8I(),
            tools: y,
            verbose: F.verbose,
            mcpClients: l,
            maxThinkingTokens: F.maxThinkingTokens,
            maxTurns: F.maxTurns,
            maxBudgetUsd: F.maxBudgetUsd,
            canUseTool: Z,
            userSpecifiedModel: P,
            fallbackModel: F.fallbackModel,
            mutableMessages: N,
            customSystemPrompt: F.systemPrompt,
            appendSystemPrompt: F.appendSystemPrompt,
            getAppState: J,
            setAppState: X,
            messageQueueManager: C,
            abortController: D,
            replayUserMessages: F.replayUserMessages,
            includePartialMessages: F.includePartialMessages,
            agents: W,
            setSDKStatus: (WA) => {
              E.enqueue({
                type: "system",
                subtype: "status",
                status: WA,
                session_id: L0(),
                uuid: C21(),
              });
            },
          })) {
            let WA =
                (QA.type === "assistant" || QA.type === "user") &&
                QA.parent_tool_use_id,
              JA = QA.type === "user" && "isReplay" in QA && QA.isReplay;
            if (!WA && !JA && QA.type !== "stream_event") H.push(QA);
            E.enqueue(QA);
          }
        }
      } catch (c) {
        try {
          A.write({
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: !0,
            num_turns: 0,
            session_id: L0(),
            total_cost_usd: 0,
            usage: $y,
            modelUsage: {},
            permission_denials: [],
            uuid: C21(),
            errors: [
              c instanceof Error ? c.message : String(c),
              ..._4A().map((e) => e.error),
            ],
          });
        } catch {}
        D8(1);
        return;
      } finally {
        ((V = !1), n.start());
      }
      if (K) E.done();
    },
    o = function (l, y) {
      E.enqueue({
        type: "control_response",
        response: { subtype: "success", request_id: l.request_id, response: y },
      });
    };
  return (
    (async () => {
      let l = !1;
      for await (let y of A.structuredInput) {
        if (y.type === "control_request") {
          if (y.request.subtype === "interrupt") {
            if (D) D.abort();
            o(y);
          } else if (y.request.subtype === "initialize") {
            if (y.request.sdkMcpServers && y.request.sdkMcpServers.length > 0)
              for (let c of y.request.sdkMcpServers)
                Y[c] = { type: "sdk", name: c };
            (await A6I(
              y.request,
              y.request_id,
              l,
              E,
              Q,
              O,
              A,
              !!F.enableAuthStatus,
            ),
              (l = !0));
          } else if (y.request.subtype === "set_permission_mode") {
            let c = y.request;
            (X((e) => ({
              ...e,
              toolPermissionContext: B6I(
                c,
                y.request_id,
                e.toolPermissionContext,
                E,
              ),
            })),
              o(y));
          } else if (y.request.subtype === "set_model") {
            let c = y.request.model === "default" ? On() : y.request.model;
            ((P = c), Xl(c), o(y));
          } else if (y.request.subtype === "set_max_thinking_tokens") {
            if (y.request.max_thinking_tokens === null)
              F.maxThinkingTokens = void 0;
            else F.maxThinkingTokens = y.request.max_thinking_tokens;
            o(y);
          } else if (y.request.subtype === "mcp_status") {
            let c = [...B, ...k].map((e) => {
              return {
                name: e.name,
                status: e.type,
                serverInfo: e.type === "connected" ? e.serverInfo : void 0,
              };
            });
            o(y, { mcpServers: c });
          } else if (y.request.subtype === "mcp_message") {
            let c = y.request,
              e = k.find((QA) => QA.name === c.server_name);
            if (e && e.type === "connected") {
              if (e.client.transport?.onmessage)
                e.client.transport.onmessage(c.message);
            }
            o(y);
          }
          continue;
        } else if (y.type === "control_response") {
          if (F.replayUserMessages) E.enqueue(y);
          continue;
        } else if (y.type === "keep_alive") continue;
        if (((l = !0), y.uuid)) {
          let c = L0();
          if ((await Ao2(c, y.uuid)) || Z09.has(y.uuid)) {
            if (
              (g(`Skipping duplicate user message: ${y.uuid}`),
              F.replayUserMessages)
            )
              (g(
                `Sending acknowledgment for duplicate user message: ${y.uuid}`,
              ),
                E.enqueue({
                  type: "user",
                  message: y.message,
                  session_id: c,
                  parent_tool_use_id: null,
                  uuid: y.uuid,
                  isReplay: !0,
                }));
            continue;
          }
          Z09.add(y.uuid);
        }
        if (
          (C.enqueue({
            mode: "prompt",
            value: y.message.content,
            uuid: y.uuid,
          }),
          !V)
        )
          m();
      }
      if (((K = !0), !V)) E.done();
    })(),
    E
  );
}
function t8I(A) {
  let B = async (Q, I, G, Z, Y) => {
    let J = await DL(Q, I, G, Z, Y);
    if (J.behavior === "allow" || J.behavior === "deny") return J;
    let X = await A.call(
      { tool_name: Q.name, input: I, tool_use_id: Y },
      G,
      B,
      Z,
    );
    if (G.abortController.signal.aborted)
      return {
        behavior: "deny",
        message: "Permission prompt was aborted.",
        decisionReason: {
          type: "permissionPromptTool",
          permissionPromptToolName: Q.name,
          toolResult: X,
        },
      };
    let W = A.mapToolResultToToolResultBlockParam(X.data, "1");
    if (
      !W.content ||
      !Array.isArray(W.content) ||
      !W.content[0] ||
      W.content[0].type !== "text" ||
      typeof W.content[0].text !== "string"
    )
      throw Error(
        'Permission prompt tool returned an invalid result. Expected a single text block param with type="text" and a string text value.',
      );
    return yqA(F21.parse(b3(W.content[0].text)), A, I, G);
  };
  return B;
}
function e8I(A, B, Q) {
  if (A === "stdio") return B.createCanUseTool();
  else if (A) {
    let I = Q.find((G) => G.name === A);
    if (!I) {
      let G = `Error: MCP tool ${A} (passed via --permission-prompt-tool) not found. Available MCP tools: ${Q.map((Z) => Z.name).join(", ") || "none"}`;
      throw (
        process.stderr.write(`${G}
`),
        D8(1),
        Error(G)
      );
    }
    if (!I.inputJSONSchema) {
      let G = `Error: tool ${A} (passed via --permission-prompt-tool) must be an MCP tool`;
      throw (
        process.stderr.write(`${G}
`),
        D8(1),
        Error(G)
      );
    }
    return t8I(I);
  }
  return DL;
}
async function A6I(A, B, Q, I, G, Z, Y, J) {
  if (Q) {
    I.enqueue({
      type: "control_response",
      response: {
        subtype: "error",
        error: "Already initialized",
        request_id: B,
        pending_permission_requests: Y.getPendingPermissionRequests(),
      },
    });
    return;
  }
  let W = N0()?.outputStyle || nF,
    F = await Xt(),
    C = h01();
  if (A.hooks) {
    let V = {};
    for (let [K, D] of Object.entries(A.hooks))
      V[K] = D.map((E) => {
        let H = E.hookCallbackIds.map((w) => {
          return Y.createHookCallback(w, E.timeout);
        });
        return { matcher: E.matcher, hooks: H };
      });
    liA(V);
  }
  if (
    (I.enqueue({
      type: "control_response",
      response: {
        subtype: "success",
        request_id: B,
        response: {
          commands: G.map((V) => ({
            name: V.userFacingName(),
            description: V.description,
            argumentHint: V.argumentHint || "",
          })),
          output_style: W,
          available_output_styles: Object.keys(F),
          models: Z,
          account: {
            email: C?.email,
            organization: C?.organization,
            subscriptionType: C?.subscription,
            tokenSource: C?.tokenSource,
            apiKeySource: C?.apiKeySource,
          },
        },
      },
    }),
    J)
  ) {
    let K = nK.getInstance().getStatus();
    if (K)
      I.enqueue({
        type: "auth_status",
        isAuthenticating: K.isAuthenticating,
        output: K.output,
        error: K.error,
        uuid: C21(),
        session_id: L0(),
      });
  }
}
function B6I(A, B, Q, I) {
  if (A.mode === "bypassPermissions" && kr2())
    return (
      I.enqueue({
        type: "control_response",
        response: {
          subtype: "error",
          request_id: B,
          error:
            "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration",
        },
      }),
      Q
    );
  return (
    I.enqueue({
      type: "control_response",
      response: {
        subtype: "success",
        request_id: B,
        response: { mode: A.mode },
      },
    }),
    { ...Q, mode: A.mode }
  );
}
async function Q6I(A) {
  if (A.continue)
    try {
      GA("tengu_continue_print", {});
      let B = await Xc(void 0, void 0);
      if (B) {
        if (!A.forkSession) {
          if (B.sessionId) (QM(B.sessionId), await Vy());
        }
        return B.messages;
      }
    } catch (B) {
      return (BA(B instanceof Error ? B : Error(String(B)), CG0), D8(1), []);
    }
  if (A.teleport)
    try {
      GA("tengu_teleport_print", {});
      let B = typeof A.teleport === "string" ? A.teleport : null;
      await b11();
      let Q = await RwA(B);
      return (await MwA(Cb(Q.log), Q.branch)).messages;
    } catch (B) {
      return (BA(B instanceof Error ? B : Error(String(B)), wk), D8(1), []);
    }
  if (A.resume)
    try {
      GA("tengu_resume_print", {});
      let B = B09(typeof A.resume === "string" ? A.resume : "");
      if (!B) {
        if (
          (process.stderr
            .write(`Error: --resume requires a valid session ID when used with --print
`),
          process.stderr.write(`Usage: claude -p --resume <session-id>
`),
          typeof A.resume === "string")
        )
          (process.stderr
            .write(`Session IDs must be in UUID format (e.g., 550e8400-e29b-41d4-a716-446655440000)
`),
            process.stderr
              .write(`Provided value "${A.resume}" is not a valid UUID
`));
        return (D8(1), []);
      }
      if (B.isUrl && B.ingressUrl) await sr2(B.sessionId, B.ingressUrl);
      let Q = await Xc(B.sessionId, B.jsonlFile || void 0);
      if (!Q)
        if (B.isUrl) return await Cw("startup");
        else
          return (
            process.stderr
              .write(`No conversation found with session ID: ${B.sessionId}
`),
            D8(1),
            []
          );
      if (A.resumeSessionAt) {
        let I = Q.messages.findIndex(
          (G) => G.type === "assistant" && G.message.id === A.resumeSessionAt,
        );
        if (I < 0)
          return (
            process.stderr
              .write(`No assistant message found with message.id of: ${A.resumeSessionAt}
`),
            D8(1),
            []
          );
        Q.messages = I >= 0 ? Q.messages.slice(0, I + 1) : [];
      }
      if (!A.forkSession && Q.sessionId) (QM(Q.sessionId), await Vy());
      return Q.messages;
    } catch (B) {
      return (
        BA(B instanceof Error ? B : Error(String(B)), VG0),
        process.stderr.write(`Failed to resume session with --print mode
`),
        D8(1),
        []
      );
    }
  return await Cw("startup");
}
function I6I(A, B) {
  let Q;
  if (typeof A === "string")
    if (A.trim() !== "")
      Q = Tm1([
        JSON.stringify({
          type: "user",
          session_id: "",
          message: { role: "user", content: A },
          parent_tool_use_id: null,
        }),
      ]);
    else Q = Tm1([]);
  else Q = A;
  return B.sdkUrl ? new Q20(B.sdkUrl, Q) : new kqA(Q);
}
var Z09;
var J09 = T(() => {
  A20();
  a19();
  H0();
  C0();
  c5A();
  c1();
  kc1();
  FQ1();
  dIA();
  Tv();
  Gr();
  o19();
  xY();
  e19();
  Q0A();
  lo();
  f3();
  wC();
  tQ0();
  vG();
  Ps();
  Gy();
  OQ();
  OIA();
  F2();
  fm();
  Q09();
  E7();
  gj();
  G09();
  ez();
  iIA();
  uB1();
  PwA();
  Y9();
  i0();
  VW();
  Z09 = new Set();
});
async function W09() {
  (GA("tengu_update_check", {}),
    F9(`Current version: ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION}
`),
    F9(`Checking for updates...
`),
    g("update: Starting update check"),
    g("update: Running diagnostic"));
  let A = await SIA();
  if (
    (g(`update: Installation type: ${A.installationType}`),
    g(`update: Config install method: ${A.configInstallMethod}`),
    A.multipleInstallations.length > 1)
  ) {
    (F9(`
`),
      F9(
        iA.yellow("Warning: Multiple installations found") +
          `
`,
      ));
    for (let J of A.multipleInstallations) {
      let X = A.installationType === J.type ? " (currently running)" : "";
      F9(`- ${J.type} at ${J.path}${X}
`);
    }
  }
  if (A.warnings.length > 0) {
    F9(`
`);
    for (let J of A.warnings)
      (g(`update: Warning detected: ${J.issue}`),
        g(`update: Showing warning: ${J.issue}`),
        F9(
          iA.yellow(`Warning: ${J.issue}
`),
        ),
        F9(
          iA.bold(`Fix: ${J.fix}
`),
        ));
  }
  let B = L1();
  if (!B.installMethod && A.installationType !== "package-manager") {
    (F9(`
`),
      F9(`Updating configuration to track installation method...
`));
    let J = "unknown";
    switch (A.installationType) {
      case "npm-local":
        J = "local";
        break;
      case "native":
        J = "native";
        break;
      case "npm-global":
        J = "global";
        break;
      default:
        J = "unknown";
    }
    (n0({ ...B, installMethod: J }),
      F9(`Installation method set to: ${J}
`));
  }
  if (A.installationType === "development")
    (F9(`
`),
      F9(
        iA.yellow("Warning: Cannot update development build") +
          `
`,
      ),
      await P6(1));
  if (A.installationType === "package-manager") {
    let J = jIA();
    if (
      (F9(`
`),
      J === "homebrew")
    ) {
      F9(`Claude is managed by Homebrew.
`);
      let X = await sr();
      if (
        X &&
        !X09.gte(
          {
            ISSUES_EXPLAINER:
              "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://docs.claude.com/s/claude-code",
            VERSION: "2.0.42",
            FEEDBACK_CHANNEL:
              "https://github.com/anthropics/claude-code/issues",
          }.VERSION,
          X,
          { loose: !0 },
        )
      )
        (F9(`Update available: ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION} → ${X}
`),
          F9(`
`),
          F9(`To update, run:
`),
          F9(
            iA.bold("  brew upgrade claude-code") +
              `
`,
          ));
      else
        F9(`Claude is up to date!
`);
    } else
      (F9(`Claude is managed by a package manager.
`),
        F9(`Please use your package manager to update.
`));
    await P6(0);
  }
  if (
    B.installMethod &&
    A.configInstallMethod !== "not set" &&
    A.installationType !== "package-manager"
  ) {
    let { installationType: J, configInstallMethod: X } = A,
      F =
        {
          "npm-local": "local",
          "npm-global": "global",
          native: "native",
          development: "development",
          unknown: "unknown",
        }[J] || J;
    if (F !== X && X !== "unknown")
      (F9(`
`),
        F9(
          iA.yellow("Warning: Configuration mismatch") +
            `
`,
        ),
        F9(`Config expects: ${X} installation
`),
        F9(`Currently running: ${J}
`),
        F9(
          iA.yellow(`Updating the ${J} installation you are currently using`) +
            `
`,
        ),
        n0({ ...B, installMethod: F }),
        F9(`Config updated to reflect current installation method: ${F}
`));
  }
  if (A.installationType === "native") {
    g("update: Detected native installation, using native updater");
    try {
      let J = await dv();
      if (J.lockFailed)
        (F9(
          iA.yellow(
            "Another process is currently updating Claude. Please try again in a moment.",
          ) +
            `
`,
        ),
          await P6(0));
      if (!J.latestVersion)
        (process.stderr.write(`Failed to check for updates
`),
          await P6(1));
      if (
        J.latestVersion ===
        {
          ISSUES_EXPLAINER:
            "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://docs.claude.com/s/claude-code",
          VERSION: "2.0.42",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        }.VERSION
      )
        F9(
          iA.green(
            `Claude Code is up to date (${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION})`,
          ) +
            `
`,
        );
      else if (J.wasUpdated)
        F9(
          iA.green(
            `Successfully updated from ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION} to version ${J.latestVersion}`,
          ) +
            `
`,
        );
      else
        F9(
          iA.green(
            `Claude Code is up to date (${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION})`,
          ) +
            `
`,
        );
      await P6(0);
    } catch (J) {
      (process.stderr.write(`Error: Failed to install native update
`),
        process.stderr.write(
          String(J) +
            `
`,
        ),
        process.stderr.write(`Try running "claude doctor" for diagnostics
`),
        await P6(1));
    }
  }
  if (B.installMethod !== "native") xzA();
  (g("update: Checking npm registry for latest version"),
    g(
      `update: Package URL: ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.PACKAGE_URL}`,
    ));
  let Q = `npm view ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.PACKAGE_URL}@latest version`;
  g(`update: Running: ${Q}`);
  let I = await sr();
  if ((g(`update: Latest version from npm: ${I || "FAILED"}`), !I)) {
    if (
      (g("update: Failed to get latest version from npm registry"),
      process.stderr.write(
        iA.red("Failed to check for updates") +
          `
`,
      ),
      process.stderr.write(`Unable to fetch latest version from npm registry
`),
      process.stderr.write(`
`),
      process.stderr.write(`Possible causes:
`),
      process.stderr.write(`  • Network connectivity issues
`),
      process.stderr.write(`  • npm registry is unreachable
`),
      process.stderr.write(`  • Corporate proxy/firewall blocking npm
`),
      {
        ISSUES_EXPLAINER:
          "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://docs.claude.com/s/claude-code",
        VERSION: "2.0.42",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      }.PACKAGE_URL &&
        !{
          ISSUES_EXPLAINER:
            "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://docs.claude.com/s/claude-code",
          VERSION: "2.0.42",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        }.PACKAGE_URL.startsWith("@anthropic"))
    )
      process.stderr.write(`  • Internal/development build not published to npm
`);
    (process.stderr.write(`
`),
      process.stderr.write(`Try:
`),
      process.stderr.write(`  • Check your internet connection
`),
      process.stderr.write(`  • Run with --debug flag for more details
`));
    let J =
      {
        ISSUES_EXPLAINER:
          "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://docs.claude.com/s/claude-code",
        VERSION: "2.0.42",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      }.PACKAGE_URL || "@anthropic-ai/claude-code";
    (process.stderr.write(`  • Manually check: npm view ${J} version
`),
      process.stderr.write(`  • Check if you need to login: npm whoami
`),
      await P6(1));
  }
  if (
    I ===
    {
      ISSUES_EXPLAINER:
        "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://docs.claude.com/s/claude-code",
      VERSION: "2.0.42",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    }.VERSION
  )
    (F9(
      iA.green(
        `Claude Code is up to date (${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION})`,
      ) +
        `
`,
    ),
      await P6(0));
  (F9(`New version available: ${I} (current: ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION})
`),
    F9(`Installing update...
`));
  let G = !1,
    Z = "";
  switch (A.installationType) {
    case "npm-local":
      ((G = !0), (Z = "local"));
      break;
    case "npm-global":
      ((G = !1), (Z = "global"));
      break;
    case "unknown": {
      let J = Qc();
      ((G = J),
        (Z = J ? "local" : "global"),
        F9(
          iA.yellow("Warning: Could not determine installation type") +
            `
`,
        ),
        F9(`Attempting ${Z} update based on file detection...
`));
      break;
    }
    default:
      (process.stderr
        .write(`Error: Cannot update ${A.installationType} installation
`),
        await P6(1));
  }
  (F9(`Using ${Z} installation update method...
`),
    g(`update: Update method determined: ${Z}`),
    g(`update: useLocalUpdate: ${G}`));
  let Y;
  if (G)
    (g("update: Calling installOrUpdateClaudePackage() for local update"),
      (Y = await lr()));
  else
    (g("update: Calling installGlobalPackage() for global update"),
      (Y = await yzA()));
  switch ((g(`update: Installation status: ${Y}`), Y)) {
    case "success":
      F9(
        iA.green(
          `Successfully updated from ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION} to version ${I}`,
        ) +
          `
`,
      );
      break;
    case "no_permissions":
      if (
        (process.stderr.write(`Error: Insufficient permissions to install update
`),
        G)
      )
        (process.stderr.write(`Try manually updating with:
`),
          process.stderr
            .write(`  cd ~/.claude/local && npm update ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.PACKAGE_URL}
`));
      else
        (process.stderr.write(`Try running with sudo or fix npm permissions
`),
          process.stderr
            .write(`Or consider migrating to a local installation with:
`),
          process.stderr.write(`  claude migrate-installer
`));
      await P6(1);
      break;
    case "install_failed":
      if (
        (process.stderr.write(`Error: Failed to install update
`),
        G)
      )
        (process.stderr.write(`Try manually updating with:
`),
          process.stderr
            .write(`  cd ~/.claude/local && npm update ${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.PACKAGE_URL}
`));
      else
        (process.stderr
          .write(`Or consider migrating to a local installation with:
`),
          process.stderr.write(`  claude migrate-installer
`));
      await P6(1);
      break;
    case "in_progress":
      (process.stderr
        .write(`Error: Another instance is currently performing an update
`),
        process.stderr.write(`Please wait and try again later
`),
        await P6(1));
      break;
  }
  await P6(0);
}
var X09;
var F09 = T(() => {
  H0();
  PIA();
  $tA();
  kB();
  WR();
  FR();
  Gc();
  f2();
  C0();
  xY();
  X09 = IA(yM(), 1);
});
import { homedir as G6I } from "node:os";
import { join as Z6I } from "node:path";
function Y6I() {
  let A = O0.platform === "win32",
    B = G6I();
  if (A) return Z6I(B, ".local", "bin", "claude.exe").replace(/\//g, "\\");
  return "~/.local/bin/claude";
}
function C09({ messages: A }) {
  if (A.length === 0) return null;
  return e4.default.createElement(
    S,
    { flexDirection: "column", gap: 0, marginBottom: 1 },
    e4.default.createElement(
      S,
      null,
      e4.default.createElement(
        U,
        { color: "warning" },
        E1.warning,
        " Setup notes:",
      ),
    ),
    A.map((B, Q) =>
      e4.default.createElement(
        S,
        { key: Q, marginLeft: 2 },
        e4.default.createElement(U, { dimColor: !0 }, "• ", B),
      ),
    ),
  );
}
function J6I({ onDone: A, force: B, target: Q }) {
  let [I, G] = e4.useState({ type: "checking" });
  return (
    e4.useEffect(() => {
      async function Z() {
        try {
          (g(
            `Install: Starting installation process (force=${B}, target=${Q})`,
          ),
            G({ type: "installing", version: Q || "stable" }),
            g(
              `Install: Calling installLatest(force=true, target=${Q}, forceReinstall=${B})`,
            ));
          let J = await dv(!0, Q, B);
          if (
            (g(
              `Install: installLatest returned version=${J.latestVersion}, wasUpdated=${J.wasUpdated}, lockFailed=${J.lockFailed}`,
            ),
            J.lockFailed)
          )
            throw Error(
              "Could not install - another process is currently installing Claude. Please try again in a moment.",
            );
          if (!J.latestVersion)
            g(
              "Install: Failed to retrieve version information during install",
              { level: "error" },
            );
          if (!J.wasUpdated) g("Install: Already up to date");
          G({ type: "setting-up" });
          let X = await kS(!0);
          if (
            (g(`Install: Setup launcher completed with ${X.length} messages`),
            X.length > 0)
          )
            X.forEach((D) => g(`Install: Setup message: ${D.message}`));
          g("Install: Cleaning up npm installations after successful install");
          let { removed: W, errors: F, warnings: C } = await bzA();
          if (W > 0) g(`Cleaned up ${W} npm installation(s)`);
          if (F.length > 0) g(`Cleanup errors: ${F.join(", ")}`);
          let V = vzA();
          if (V.length > 0)
            g(`Shell alias cleanup: ${V.map((D) => D.message).join("; ")}`);
          GA("tengu_claude_install_command", {
            has_version: J.latestVersion ? 1 : 0,
            forced: B ? 1 : 0,
          });
          let K = [...C, ...V.map((D) => D.message)];
          if (X.length > 0)
            (G({ type: "set-up", messages: X.map((D) => D.message) }),
              setTimeout(() => {
                G({
                  type: "success",
                  version: J.latestVersion || "current",
                  setupMessages: [...X.map((D) => D.message), ...K],
                });
              }, 2000));
          else
            (g("Install: Shell PATH already configured"),
              G({
                type: "success",
                version: J.latestVersion || "current",
                setupMessages: K.length > 0 ? K : void 0,
              }));
        } catch (Y) {
          (g(`Install command failed: ${Y}`, { level: "error" }),
            G({
              type: "error",
              message: Y instanceof Error ? Y.message : String(Y),
            }));
        }
      }
      Z();
    }, [B, Q]),
    e4.useEffect(() => {
      if (I.type === "success")
        setTimeout(() => {
          A("Claude Code installation completed successfully", {
            display: "system",
          });
        }, 2000);
      else if (I.type === "error")
        setTimeout(() => {
          A("Claude Code installation failed", { display: "system" });
        }, 3000);
    }, [I, A]),
    e4.default.createElement(
      S,
      { flexDirection: "column", marginTop: 1 },
      I.type === "checking" &&
        e4.default.createElement(
          U,
          { color: "claude" },
          "Checking installation status...",
        ),
      I.type === "cleaning-npm" &&
        e4.default.createElement(
          U,
          { color: "warning" },
          "Cleaning up old npm installations...",
        ),
      I.type === "installing" &&
        e4.default.createElement(
          U,
          { color: "claude" },
          "Installing Claude Code native build ",
          I.version,
          "...",
        ),
      I.type === "setting-up" &&
        e4.default.createElement(
          U,
          { color: "claude" },
          "Setting up launcher and shell integration...",
        ),
      I.type === "set-up" &&
        e4.default.createElement(C09, { messages: I.messages }),
      I.type === "success" &&
        e4.default.createElement(
          S,
          { flexDirection: "column", gap: 1 },
          e4.default.createElement(
            S,
            null,
            e4.default.createElement(U, { color: "success" }, E1.tick, " "),
            e4.default.createElement(
              U,
              { color: "success", bold: !0 },
              "Claude Code successfully installed!",
            ),
          ),
          e4.default.createElement(
            S,
            { marginLeft: 2, flexDirection: "column", gap: 1 },
            I.version !== "current" &&
              e4.default.createElement(
                S,
                null,
                e4.default.createElement(U, { dimColor: !0 }, "Version: "),
                e4.default.createElement(U, { color: "claude" }, I.version),
              ),
            e4.default.createElement(
              S,
              null,
              e4.default.createElement(U, { dimColor: !0 }, "Location: "),
              e4.default.createElement(U, { color: "text" }, Y6I()),
            ),
          ),
          e4.default.createElement(
            S,
            { marginLeft: 2, flexDirection: "column", gap: 1 },
            e4.default.createElement(
              S,
              { marginTop: 1 },
              e4.default.createElement(U, { dimColor: !0 }, "Next: Run "),
              e4.default.createElement(
                U,
                { color: "claude", bold: !0 },
                "claude --help",
              ),
              e4.default.createElement(U, { dimColor: !0 }, " to get started"),
            ),
          ),
          I.setupMessages &&
            e4.default.createElement(C09, { messages: I.setupMessages }),
        ),
      I.type === "error" &&
        e4.default.createElement(
          S,
          { flexDirection: "column", gap: 1 },
          e4.default.createElement(
            S,
            null,
            e4.default.createElement(U, { color: "error" }, E1.cross, " "),
            e4.default.createElement(
              U,
              { color: "error" },
              "Installation failed",
            ),
          ),
          e4.default.createElement(U, { color: "error" }, I.message),
          e4.default.createElement(
            S,
            { marginTop: 1 },
            e4.default.createElement(
              U,
              { dimColor: !0 },
              "Try running with --force to override checks",
            ),
          ),
        ),
    )
  );
}
var e4, V09;
var K09 = T(() => {
  nA();
  nA();
  FR();
  C0();
  H0();
  s2();
  C6();
  e4 = IA(KA(), 1);
  V09 = {
    type: "local-jsx",
    name: "install",
    description: "Install Claude Code native build",
    argumentHint: "[options]",
    async call(A, B, Q) {
      let I = Q.includes("--force"),
        Z = Q.filter((J) => !J.startsWith("--"))[0],
        { unmount: Y } = await I5(
          e4.default.createElement(J6I, {
            onDone: (J, X) => {
              (Y(), A(J, X));
            },
            force: I,
            target: Z,
          }),
        );
    },
  };
});
function E09({ onSelect: A, onCancel: B, isEmbedded: Q = !1 }) {
  let { rows: I } = aB(),
    [G, Z] = F4.useState([]),
    [Y, J] = F4.useState(null),
    [X, W] = F4.useState(!0),
    [F, C] = F4.useState(null),
    [V, K] = F4.useState(!1),
    [D, E] = F4.useState(!1),
    H = F4.useCallback(async () => {
      try {
        (W(!0), C(null));
        let b = await Fb();
        (J(b), g(`Current repository: ${b || "not detected"}`));
        let x = await XT2(),
          n = x;
        if (b)
          ((n = x.filter((o) => {
            if (!o.repo) return !1;
            return `${o.repo.owner.login}/${o.repo.name}` === b;
          })),
            g(
              `Filtered ${n.length} sessions for repo ${b} from ${x.length} total`,
            ));
        let m = [...n].sort((o, l) => {
          let y = new Date(o.updated_at);
          return new Date(l.updated_at).getTime() - y.getTime();
        });
        Z(m);
      } catch (b) {
        let x = b instanceof Error ? b.message : String(b);
        (g(`Error loading code sessions: ${x}`), C(W6I(x)));
      } finally {
        (W(!1), K(!1));
      }
    }, []),
    w = () => {
      (K(!0), H());
    };
  h1((b, x) => {
    if (x.escape || (x.ctrl && b === "c")) {
      B();
      return;
    }
    if (x.ctrl && b === "r" && F) {
      w();
      return;
    }
    if (F !== null && x.return) {
      B();
      return;
    }
  });
  let L = F4.useCallback(() => {
    (E(!0), H());
  }, [E, H]);
  if (!D) return F4.default.createElement(v11, { onComplete: L });
  if (X)
    return F4.default.createElement(
      S,
      { flexDirection: "column", padding: 1 },
      F4.default.createElement(
        S,
        { flexDirection: "row" },
        F4.default.createElement(E8, null),
        F4.default.createElement(
          U,
          { bold: !0 },
          "Loading Claude Code sessions…",
        ),
      ),
      F4.default.createElement(
        U,
        { dimColor: !0 },
        V ? "Retrying…" : "Fetching your Claude Code sessions…",
      ),
    );
  if (F)
    return F4.default.createElement(
      S,
      { flexDirection: "column", padding: 1 },
      F4.default.createElement(
        U,
        { bold: !0, color: "error" },
        "Error loading Claude Code sessions",
      ),
      F6I(F),
      F4.default.createElement(
        U,
        { dimColor: !0 },
        "Press ",
        F4.default.createElement(U, { bold: !0 }, "Ctrl+R"),
        " to retry · Press ",
        F4.default.createElement(U, { bold: !0 }, "Esc"),
        " ",
        "to cancel",
      ),
    );
  if (G.length === 0)
    return F4.default.createElement(
      S,
      { flexDirection: "column", padding: 1 },
      F4.default.createElement(
        U,
        { bold: !0 },
        "No Claude Code sessions found",
        Y && F4.default.createElement(U, null, " for ", Y),
      ),
      F4.default.createElement(
        S,
        { marginTop: 1 },
        F4.default.createElement(
          U,
          { dimColor: !0 },
          "Press ",
          F4.default.createElement(U, { bold: !0 }, "Esc"),
          " to cancel",
        ),
      ),
    );
  let N = G.map((b) => ({ ...b, timeString: vPA(new Date(b.updated_at)) })),
    $ = Math.max(D09.length, ...N.map((b) => b.timeString.length)),
    O = N.map(({ timeString: b, title: x, id: n }) => {
      return { label: `${b.padEnd($, " ")}  ${x}`, value: n };
    }),
    P = Q ? Math.min(G.length + 7, I - 6) : I - 1,
    k = Q ? Math.min(G.length, 12) : Math.min(G.length, I - 6);
  return F4.default.createElement(
    S,
    { flexDirection: "column", padding: 1, height: P },
    F4.default.createElement(
      U,
      { bold: !0 },
      "Select a session to resume",
      Y && F4.default.createElement(U, { dimColor: !0 }, " (", Y, ")"),
      ":",
    ),
    F4.default.createElement(
      S,
      { flexDirection: "column", marginY: 1, flexGrow: 1 },
      F4.default.createElement(
        S,
        { marginLeft: 2 },
        F4.default.createElement(
          U,
          { bold: !0 },
          D09.padEnd($, " "),
          X6I,
          "Session Title",
        ),
      ),
      F4.default.createElement($0, {
        visibleOptionCount: k,
        options: O,
        onCancel: () => {},
        onChange: (b) => {
          let x = G.find((n) => n.id === b);
          if (x) A(x);
        },
      }),
    ),
    F4.default.createElement(
      S,
      { flexDirection: "row" },
      F4.default.createElement(
        U,
        { dimColor: !0 },
        "↑/↓ to select · Enter to confirm · Esc to cancel",
      ),
    ),
  );
}
function W6I(A) {
  let B = A.toLowerCase();
  if (B.includes("fetch") || B.includes("network") || B.includes("timeout"))
    return "network";
  if (
    B.includes("auth") ||
    B.includes("token") ||
    B.includes("permission") ||
    B.includes("oauth") ||
    B.includes("not authenticated") ||
    B.includes("/login") ||
    B.includes("console account") ||
    B.includes("403")
  )
    return "auth";
  if (
    B.includes("api") ||
    B.includes("rate limit") ||
    B.includes("500") ||
    B.includes("529")
  )
    return "api";
  return "other";
}
function F6I(A) {
  switch (A) {
    case "network":
      return F4.default.createElement(
        S,
        { marginY: 1, flexDirection: "column" },
        F4.default.createElement(
          U,
          { dimColor: !0 },
          "Check your internet connection",
        ),
      );
    case "auth":
      return F4.default.createElement(
        S,
        { marginY: 1, flexDirection: "column" },
        F4.default.createElement(
          U,
          { dimColor: !0 },
          "Teleport requires a Claude account",
        ),
        F4.default.createElement(
          U,
          { dimColor: !0 },
          "Run ",
          F4.default.createElement(U, { bold: !0 }, "/login"),
          ' and select "Claude account with subscription"',
        ),
      );
    case "api":
      return F4.default.createElement(
        S,
        { marginY: 1, flexDirection: "column" },
        F4.default.createElement(
          U,
          { dimColor: !0 },
          "Sorry, Claude encountered an error",
        ),
      );
    case "other":
      return F4.default.createElement(
        S,
        { marginY: 1, flexDirection: "row" },
        F4.default.createElement(
          U,
          { dimColor: !0 },
          "Sorry, Claude Code encountered an error",
        ),
      );
  }
}
var F4,
  D09 = "Updated",
  X6I = "  ";
var H09 = T(() => {
  nA();
  R5();
  xX();
  N8();
  C0();
  ct1();
  o3A();
  po();
  F4 = IA(KA(), 1);
});
function z09(A) {
  let [B, Q] = Tt.useState(!1),
    [I, G] = Tt.useState(null),
    [Z, Y] = Tt.useState(null),
    J = Tt.useCallback(
      async (W) => {
        (Q(!0),
          G(null),
          Y(W),
          GA("tengu_teleport_resume_session", { source: A, session_id: W.id }));
        try {
          let F = await OwA(W.id);
          return (Q(!1), F);
        } catch (F) {
          let C = {
            message:
              F instanceof TZ
                ? F.message
                : F instanceof Error
                  ? F.message
                  : String(F),
            formattedMessage: F instanceof TZ ? F.formattedMessage : void 0,
            isOperationError: F instanceof TZ,
          };
          return (G(C), Q(!1), null);
        }
      },
      [A],
    ),
    X = Tt.useCallback(() => {
      G(null);
    }, []);
  return {
    resumeSession: J,
    isResuming: B,
    error: I,
    selectedSession: Z,
    clearError: X,
  };
}
var Tt;
var U09 = T(() => {
  lo();
  y7();
  H0();
  Tt = IA(KA(), 1);
});
function C6I({
  onComplete: A,
  onCancel: B,
  onError: Q,
  isEmbedded: I = !1,
  source: G,
}) {
  let {
      resumeSession: Z,
      isResuming: Y,
      error: J,
      selectedSession: X,
    } = z09(G),
    W = async (C) => {
      let V = await Z(C);
      if (V) A(V);
      else if (J) {
        if (Q) Q(J.message, J.formattedMessage);
      }
    },
    F = () => {
      (GA("tengu_teleport_cancelled", {}), B());
    };
  if (Y && X)
    return RE.default.createElement(
      S,
      { flexDirection: "column", padding: 1 },
      RE.default.createElement(
        S,
        { flexDirection: "row" },
        RE.default.createElement(E8, null),
        RE.default.createElement(U, { bold: !0 }, "Resuming session…"),
      ),
      RE.default.createElement(U, { dimColor: !0 }, 'Loading "', X.title, '"…'),
    );
  if (J && !Q)
    return RE.default.createElement(
      S,
      { flexDirection: "column", padding: 1 },
      RE.default.createElement(
        U,
        { bold: !0, color: "error" },
        "Failed to resume session",
      ),
      RE.default.createElement(U, { dimColor: !0 }, J.message),
      RE.default.createElement(
        S,
        { marginTop: 1 },
        RE.default.createElement(
          U,
          { dimColor: !0 },
          "Press ",
          RE.default.createElement(U, { bold: !0 }, "Esc"),
          " to cancel",
        ),
      ),
    );
  return RE.default.createElement(E09, {
    onSelect: W,
    onCancel: F,
    isEmbedded: I,
  });
}
async function w09() {
  return (
    g("selectAndResumeTeleportTask: Starting teleport flow..."),
    new Promise(async (A) => {
      let { unmount: B } = await I5(
        RE.default.createElement(
          H3,
          null,
          RE.default.createElement(C6I, {
            onComplete: (Q) => {
              (B(), A(Q));
            },
            onCancel: () => {
              (B(), A(null));
            },
            onError: (Q, I) => {
              (process.stderr.write(
                I
                  ? I +
                      `
`
                  : `Error: ${Q}
`,
              ),
                B(),
                A(null));
            },
            source: "cliArg",
          }),
        ),
        { exitOnCtrlC: !1 },
      );
    })
  );
}
var RE;
var $09 = T(() => {
  nA();
  H09();
  xX();
  U09();
  H0();
  c9();
  C0();
  RE = IA(KA(), 1);
});
function N09() {
  (q09(eK), q09(Ip));
}
function q09(A) {
  try {
    dm.call(
      { prompt: "Warmup", subagent_type: A.agentType, description: "Warmup" },
      {
        options: {
          agentDefinitions: { allAgents: [A], activeAgents: [A] },
          commands: [],
          debug: !1,
          mainLoopModel: mI(),
          tools: [],
          verbose: !1,
          maxThinkingTokens: 1000,
          mcpClients: [],
          mcpResources: {},
          isNonInteractiveSession: !1,
          hasAppendSystemPrompt: !1,
        },
        abortController: new AbortController(),
        readFileState: new AO({ max: 1000 }),
        messageQueueManager: AR(),
        getAppState: async () => tg(),
        setAppState: async () => {},
        setMessages: async () => {},
        setInProgressToolUseIDs: async () => {},
        setResponseLength: async () => {},
        updateFileHistoryState: async () => {},
        agentId: "warmup",
        messages: [],
      },
      async () => ({
        behavior: "deny",
        message: "Warmup",
        decisionReason: { type: "other", reason: "Warmup" },
      }),
      CV({ content: "Warmup" }),
      () => {},
    ).catch(() => {});
  } catch {}
}
var L09 = T(() => {
  HFA();
  BnA();
  S7A();
  c5A();
  c9();
  iB();
  Y9();
  dB1();
});
var P09 = {};
M$(P09, {
  showSetupScreens: () => T09,
  setup: () => K21,
  main: () => O6I,
  completeOnboarding: () => R09,
});
import { ReadStream as V6I } from "tty";
import {
  openSync as K6I,
  existsSync as V21,
  readFileSync as M09,
  writeFileSync as D6I,
} from "fs";
import { cwd as I20 } from "process";
import { resolve as G20 } from "path";
function E6I() {
  try {
    let A = cQ("policySettings");
    if (A) {
      let B = $o2(A);
      GA("tengu_managed_settings_loaded", {
        keyCount: B.length,
        keys: B.join(","),
      });
    }
  } catch {}
}
function H6I() {
  let A = Ai(),
    B = process.execArgv.some((I) => {
      if (A) return /--inspect(-brk)?/.test(I);
      else return /--inspect(-brk)?|--debug(-brk)?/.test(I);
    }),
    Q =
      process.env.NODE_OPTIONS &&
      /--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);
  try {
    return !!global.require("inspector").url() || B || Q;
  } catch {
    return B || Q;
  }
}
function R09() {
  let A = L1();
  n0({
    ...A,
    hasCompletedOnboarding: !0,
    lastOnboardingVersion: {
      ISSUES_EXPLAINER:
        "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://docs.claude.com/s/claude-code",
      VERSION: "2.0.42",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    }.VERSION,
  });
}
async function T09(A, B, Q) {
  if (V0(!1) || process.env.IS_DEMO) return !1;
  let I = L1(),
    G = !1;
  if (!I.theme || !I.hasCompletedOnboarding)
    ((G = !0),
      await NY(),
      await new Promise(async (Z) => {
        let { unmount: Y } = await I5(
          e5.default.createElement(
            H3,
            { onChangeAppState: vb },
            e5.default.createElement(PA9, {
              onDone: async () => {
                (R09(), Y(), await NY(), Z());
              },
            }),
          ),
          { exitOnCtrlC: !1 },
        );
      }));
  if (A !== "bypassPermissions" && process.env.CLAUBBIT !== "true") {
    let Z = fX(!1);
    if (
      (await new Promise(async (X) => {
        let { unmount: W } = await I5(
          e5.default.createElement(
            H3,
            null,
            e5.default.createElement(pA9, {
              commands: Q,
              onDone: async () => {
                if ((W(), !Z)) await NY();
                X();
              },
            }),
          ),
          { exitOnCtrlC: !1 },
        );
      }),
      YqA())
    )
      le2();
    WV();
    let { errors: J } = oc();
    if (J.length === 0) await P19();
    if (await PNQ())
      await new Promise(async (X) => {
        let { unmount: W } = await I5(
          e5.default.createElement(
            H3,
            null,
            e5.default.createElement(d01, {
              onDone: () => {
                (W(), X());
              },
              isStandaloneDialog: !0,
            }),
          ),
          { exitOnCtrlC: !1 },
        );
      });
  }
  if (await lIA())
    await new Promise(async (Z) => {
      let { unmount: Y } = await I5(
        e5.default.createElement(
          H3,
          null,
          e5.default.createElement(gB1, {
            showIfAlreadyViewed: !1,
            location: G ? "onboarding" : "policy_update_modal",
            onDone: async (J) => {
              if (J === "escape") {
                (GA("tengu_grove_policy_exited", {}), D8(0));
                return;
              }
              if ((Y(), J !== "skip_rendering")) await NY();
              Z();
            },
          }),
        ),
        { exitOnCtrlC: !1 },
      );
    });
  if (process.env.ANTHROPIC_API_KEY) {
    let Z = lw(process.env.ANTHROPIC_API_KEY);
    if (OQ1(Z) === "new")
      await new Promise(async (J) => {
        let { unmount: X } = await I5(
          e5.default.createElement(
            H3,
            { onChangeAppState: vb },
            e5.default.createElement(I21, {
              customApiKeyTruncated: Z,
              onDone: async () => {
                (X(), await NY(), J());
              },
            }),
          ),
          { exitOnCtrlC: !1 },
        );
      });
  }
  if (
    (vQ0(),
    (A === "bypassPermissions" || B) && !L1().bypassPermissionsModeAccepted)
  )
    await new Promise(async (Z) => {
      let { unmount: Y } = await I5(
        e5.default.createElement(
          H3,
          null,
          e5.default.createElement(y19, {
            onAccept: () => {
              (Y(), Z());
            },
          }),
        ),
      );
    });
  return G;
}
async function O09(A, B) {
  try {
    let Q = await i7A(A, B);
    if (Q.type === "connected") return "✓ Connected";
    else if (Q.type === "needs-auth") return "⚠ Needs authentication";
    else return "✗ Failed to connect";
  } catch (Q) {
    return "✗ Connection error";
  }
}
function z6I() {
  let A = L1();
  (n0({ ...A, numStartups: (A.numStartups ?? 0) + 1 }), U6I(), W80()?.add(1));
}
async function U6I() {
  let [A, B] = await Promise.all([QO(), gFA()]);
  GA("tengu_startup_telemetry", { is_git: A, worktree_count: B });
}
function w6I() {
  (x19(), b19(), h19(), d19(), u19());
}
function $6I() {
  if (K5()) {
    WV();
    return;
  }
  if (fX(!0)) WV();
}
async function K21(A, B, Q, I, G) {
  let Z = process.version.match(/^v(\d+)\./)?.[1];
  if (!Z || parseInt(Z) < 18)
    (console.error(
      iA.bold.red("Error: Claude Code requires Node.js version 18 or higher."),
    ),
      process.exit(1));
  if (G) QM(G);
  DB0();
  let Y = ux0();
  if (Y.status === "restored")
    console.log(
      iA.yellow(
        "Detected an interrupted iTerm2 setup. Your original settings have been restored. You may need to restart iTerm2 for the changes to take effect.",
      ),
    );
  else if (Y.status === "failed")
    console.error(
      iA.red(
        `Failed to restore iTerm2 settings. Please manually restore your original settings with: defaults import com.googlecode.iterm2 ${Y.backupPath}.`,
      ),
    );
  try {
    let F = await $jA();
    if (F.status === "restored")
      console.log(
        iA.yellow(
          "Detected an interrupted Terminal.app setup. Your original settings have been restored. You may need to restart Terminal.app for the changes to take effect.",
        ),
      );
    else if (F.status === "failed")
      console.error(
        iA.red(
          `Failed to restore Terminal.app settings. Please manually restore your original settings with: defaults import com.apple.Terminal ${F.backupPath}.`,
        ),
      );
  } catch (F) {
    BA(F instanceof Error ? F : Error(String(F)), OZ0);
  }
  if (
    (EN(A),
    IA9(),
    JA9(),
    FA9(),
    fdQ(),
    F19(),
    Di1(),
    Ei1(),
    ae2(),
    JE(),
    H01(),
    Ts(),
    qP2(),
    FV(),
    $6I(),
    TL(),
    ho2(),
    oo2(),
    Ro2(K5()),
    V0(process.env.CLAUDE_CODE_USE_BEDROCK) &&
      !V0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH))
  )
    To2();
  (MDA().catch((F) => BA(F, MZ0)), ziA([], L0()), hzB());
  let { hasReleaseNotes: J } = swA(L1().lastReleaseNotesSeen);
  if (J) await FS2();
  let X = a9();
  if (
    (setTimeout(() => X.abort(), 3000),
    uTA(G0(), X.signal, []),
    B === "bypassPermissions" || Q)
  ) {
    if (
      process.platform !== "win32" &&
      typeof process.getuid === "function" &&
      process.getuid() === 0 &&
      !process.env.IS_SANDBOX
    )
      (console.error(
        "--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons",
      ),
        process.exit(1));
  }
  let W = v6();
  if (W.lastCost !== void 0 && W.lastDuration !== void 0)
    (GA("tengu_exit", {
      last_session_cost: W.lastCost,
      last_session_api_duration: W.lastAPIDuration,
      last_session_tool_duration: W.lastToolDuration,
      last_session_duration: W.lastDuration,
      last_session_lines_added: W.lastLinesAdded,
      last_session_lines_removed: W.lastLinesRemoved,
      last_session_total_input_tokens: W.lastTotalInputTokens,
      last_session_total_output_tokens: W.lastTotalOutputTokens,
      last_session_total_cache_creation_input_tokens:
        W.lastTotalCacheCreationInputTokens,
      last_session_total_cache_read_input_tokens:
        W.lastTotalCacheReadInputTokens,
      last_session_id: W.lastSessionId,
    }),
      uG({
        ...W,
        lastCost: void 0,
        lastAPIDuration: void 0,
        lastToolDuration: void 0,
        lastDuration: void 0,
        lastLinesAdded: void 0,
        lastLinesRemoved: void 0,
        lastTotalInputTokens: void 0,
        lastTotalOutputTokens: void 0,
        lastTotalCacheCreationInputTokens: void 0,
        lastTotalCacheReadInputTokens: void 0,
        lastSessionId: void 0,
      }));
}
function q6I(A) {
  try {
    let B = A.trim(),
      Q = B.startsWith("{") && B.endsWith("}"),
      I;
    if (Q) {
      if (!b3(B))
        (process.stderr.write(
          iA.red(`Error: Invalid JSON provided to --settings
`),
        ),
          process.exit(1));
      ((I = aoA("claude-settings", ".json")), D6I(I, B, "utf8"));
    } else {
      let { resolvedPath: G } = KC(NA(), A);
      if (!V21(G))
        (process.stderr.write(
          iA.red(`Error: Settings file not found: ${G}
`),
        ),
          process.exit(1));
      I = G;
    }
    ($80(I), f0A());
  } catch (B) {
    if (B instanceof Error) BA(B, yMA);
    (process.stderr.write(
      iA.red(`Error processing settings: ${B instanceof Error ? B.message : String(B)}
`),
    ),
      process.exit(1));
  }
}
function N6I(A) {
  try {
    let B = FT0(A);
    (j80(B), f0A());
  } catch (B) {
    if (B instanceof Error) BA(B, yMA);
    (process.stderr.write(
      iA.red(`Error processing --setting-sources: ${B instanceof Error ? B.message : String(B)}
`),
    ),
      process.exit(1));
  }
}
function L6I() {
  JI("eagerLoadSettings_start");
  let A = process.argv.findIndex((Q) => Q === "--settings");
  if (A !== -1 && A + 1 < process.argv.length) {
    let Q = process.argv[A + 1];
    if (Q) q6I(Q);
  }
  let B = process.argv.findIndex((Q) => Q === "--setting-sources");
  if (B !== -1 && B + 1 < process.argv.length) {
    let Q = process.argv[B + 1];
    if (Q !== void 0) N6I(Q);
  }
  JI("eagerLoadSettings_end");
}
function M6I(A) {
  if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
  let B = process.argv.slice(2),
    Q = B.indexOf("mcp");
  if (Q !== -1 && B[Q + 1] === "serve") {
    process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
    return;
  }
  if (V0(process.env.CLAUDE_CODE_ACTION)) {
    process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
    return;
  }
  process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli";
}
async function O6I() {
  (JI("main_function_start"),
    (process.env.NoDefaultCurrentDirectoryInExePath = "1"),
    ve2(),
    process.on("exit", () => {
      j6I();
    }),
    process.on("SIGINT", () => {
      process.exit(0);
    }),
    JI("main_warning_handler_initialized"));
  let A = process.argv.slice(2),
    B = A.includes("-p") || A.includes("--print"),
    Q = A.some((J) => J.startsWith("--sdk-url")),
    I = B || Q || !process.stdout.isTTY;
  (U80(!I), M6I(I));
  let Z = (() => {
    if (process.env.GITHUB_ACTIONS === "true") return "github-action";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts")
      return "sdk-typescript";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode")
      return "claude-vscode";
    if (
      process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN ||
      process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR
    )
      return "remote";
    return "cli";
  })();
  (w80(Z), JI("main_client_type_determined"), L6I(), JI("main_before_init"));
  let Y = pe2();
  if (Y instanceof Promise) await Y;
  (JI("main_after_init"),
    (process.title = "claude"),
    await P6I(),
    JI("main_after_run"));
}
function R6I(A) {
  let B = {
    exitOnCtrlC: A,
    onFlicker: (Q, I, G) => {
      GA("tengu_flicker", {
        desiredHeight: Q,
        actualHeight: I,
        ink2Enabled: G,
      });
    },
  };
  if (!process.stdin.isTTY && !V0(!1) && !process.argv.includes("mcp")) {
    if ((GA("tengu_stdin_interactive", {}), process.platform !== "win32"))
      try {
        let Q = K6I("/dev/tty", "r");
        B = { ...B, stdin: new V6I(Q) };
      } catch (Q) {
        BA(Q, RZ0);
      }
  }
  return B;
}
async function T6I(A, B) {
  if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
    if (B === "stream-json") return process.stdin;
    process.stdin.setEncoding("utf8");
    let Q = "";
    return (
      process.stdin.on("data", (I) => {
        Q += I;
      }),
      await new Promise((I) => {
        process.stdin.on("end", I);
      }),
      [A, Q].filter(Boolean).join(`
`)
    );
  }
  return A;
}
async function P6I() {
  (JI("run_function_start"), w6I(), JI("run_after_migrations"));
  let A = new CLA();
  (JI("run_commander_initialized"),
    A.name("claude")
      .description(
        "Claude Code - starts an interactive session by default, use -p/--print for non-interactive output",
      )
      .argument("[prompt]", "Your prompt", String)
      .helpOption("-h, --help", "Display help for command")
      .option(
        "-d, --debug [filter]",
        'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")',
        (Y) => {
          return !0;
        },
      )
      .addOption(
        new nW("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)")
          .argParser(Boolean)
          .hideHelp(),
      )
      .option(
        "--verbose",
        "Override verbose mode setting from config",
        () => !0,
      )
      .option(
        "-p, --print",
        "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.",
        () => !0,
      )
      .addOption(
        new nW(
          "--output-format <format>",
          'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)',
        ).choices(["text", "json", "stream-json"]),
      )
      .option(
        "--include-partial-messages",
        "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)",
        () => !0,
      )
      .addOption(
        new nW(
          "--input-format <format>",
          'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)',
        ).choices(["text", "stream-json"]),
      )
      .option(
        "--mcp-debug",
        "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)",
        () => !0,
      )
      .option(
        "--dangerously-skip-permissions",
        "Bypass all permission checks. Recommended only for sandboxes with no internet access.",
        () => !0,
      )
      .option(
        "--allow-dangerously-skip-permissions",
        "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.",
        () => !0,
      )
      .addOption(
        new nW(
          "--max-thinking-tokens <tokens>",
          "Maximum number of thinking tokens.  (only works with --print)",
        )
          .argParser(Number)
          .hideHelp(),
      )
      .addOption(
        new nW(
          "--max-turns <turns>",
          "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)",
        )
          .argParser(Number)
          .hideHelp(),
      )
      .addOption(
        new nW(
          "--max-budget-usd <amount>",
          "Maximum dollar amount to spend on API calls (only works with --print)",
        )
          .argParser((Y) => {
            let J = Number(Y);
            if (isNaN(J) || J <= 0)
              throw Error(
                "--max-budget-usd must be a positive number greater than 0",
              );
            return J;
          })
          .hideHelp(),
      )
      .option(
        "--replay-user-messages",
        "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)",
        () => !0,
      )
      .addOption(
        new nW(
          "--enable-auth-status",
          "Enable auth status messages in SDK mode",
        )
          .default(!1)
          .hideHelp(),
      )
      .option(
        "--allowedTools, --allowed-tools <tools...>",
        'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")',
      )
      .option(
        "--tools <tools...>",
        'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read"). Only works with --print mode.',
      )
      .option(
        "--disallowedTools, --disallowed-tools <tools...>",
        'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")',
      )
      .option(
        "--mcp-config <configs...>",
        "Load MCP servers from JSON files or strings (space-separated)",
      )
      .addOption(
        new nW(
          "--permission-prompt-tool <tool>",
          "MCP tool to use for permission prompts (only works with --print)",
        )
          .argParser(String)
          .hideHelp(),
      )
      .addOption(
        new nW(
          "--system-prompt <prompt>",
          "System prompt to use for the session",
        ).argParser(String),
      )
      .addOption(
        new nW("--system-prompt-file <file>", "Read system prompt from a file")
          .argParser(String)
          .hideHelp(),
      )
      .addOption(
        new nW(
          "--append-system-prompt <prompt>",
          "Append a system prompt to the default system prompt",
        ).argParser(String),
      )
      .addOption(
        new nW(
          "--append-system-prompt-file <file>",
          "Read system prompt from a file and append to the default system prompt",
        )
          .argParser(String)
          .hideHelp(),
      )
      .addOption(
        new nW(
          "--permission-mode <mode>",
          "Permission mode to use for the session",
        )
          .argParser(String)
          .choices(Wi),
      )
      .option(
        "-c, --continue",
        "Continue the most recent conversation",
        () => !0,
      )
      .option(
        "-r, --resume [sessionId]",
        "Resume a conversation - provide a session ID or interactively select a conversation to resume",
        (Y) => Y || !0,
      )
      .option(
        "--fork-session",
        "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)",
        () => !0,
      )
      .addOption(
        new nW(
          "--resume-session-at <message id>",
          "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)",
        )
          .argParser(String)
          .hideHelp(),
      )
      .option(
        "--model <model>",
        "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').",
      )
      .option(
        "--fallback-model <model>",
        "Enable automatic fallback to specified model when default model is overloaded (only works with --print)",
      )
      .option(
        "--settings <file-or-json>",
        "Path to a settings JSON file or a JSON string to load additional settings from",
      )
      .option(
        "--add-dir <directories...>",
        "Additional directories to allow tool access to",
      )
      .option(
        "--ide",
        "Automatically connect to IDE on startup if exactly one valid IDE is available",
        () => !0,
      )
      .option(
        "--strict-mcp-config",
        "Only use MCP servers from --mcp-config, ignoring all other MCP configurations",
        () => !0,
      )
      .option(
        "--session-id <uuid>",
        "Use a specific session ID for the conversation (must be a valid UUID)",
      )
      .option(
        "--agents <json>",
        `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`,
      )
      .option(
        "--setting-sources <sources>",
        "Comma-separated list of setting sources to load (user, project, local).",
      )
      .option(
        "--plugin-dir <paths...>",
        "Load plugins from directories for this session only (repeatable)",
      )
      .action(async (Y, J) => {
        if (Y === "code")
          (GA("tengu_code_prompt_ignored", {}),
            console.warn(
              iA.yellow("Tip: You can launch Claude Code with just `claude`"),
            ),
            (Y = void 0));
        if (Y && typeof Y === "string" && !/\s/.test(Y) && Y.length > 0)
          GA("tengu_single_word_prompt", { length: Y.length });
        let {
            debug: X = !1,
            debugToStderr: W = !1,
            dangerouslySkipPermissions: F,
            allowDangerouslySkipPermissions: C = !1,
            tools: V = [],
            allowedTools: K = [],
            disallowedTools: D = [],
            mcpConfig: E = [],
            permissionMode: H,
            addDir: w = [],
            fallbackModel: L,
            ide: N = !1,
            sessionId: $,
            includePartialMessages: O,
            pluginDir: P = [],
          } = J,
          k = J.agents;
        if (P.length > 0) y80(P);
        let { outputFormat: b, inputFormat: x } = J,
          n = J.verbose ?? L1().verbose,
          m = J.print;
        if (jc1() && (J.strictMcpConfig || J.mcpConfig))
          (process.stderr.write(
            iA.red(
              "You cannot dynamically configure your MCP configuration when an enterprise MCP config is present",
            ),
          ),
            process.exit(1));
        let o = J.strictMcpConfig || !1,
          l = !1,
          y = !1,
          c = J.sdkUrl ?? void 0;
        if (c) {
          if (!x) x = "stream-json";
          if (!b) b = "stream-json";
          if (J.verbose === void 0) n = !0;
          if (!J.print) m = !0;
        }
        let e = J.teleport ?? null,
          QA = J.remote ?? null;
        if ($) {
          if (J.continue || J.resume)
            (process.stderr.write(
              iA.red(`Error: --session-id cannot be used with --continue or --resume.
`),
            ),
              process.exit(1));
          let K0 = Vz($);
          if (!K0)
            (process.stderr.write(
              iA.red(`Error: Invalid session ID. Must be a valid UUID.
`),
            ),
              process.exit(1));
          if (ir2(K0))
            (process.stderr.write(
              iA.red(`Error: Session ID ${K0} is already in use.
`),
            ),
              process.exit(1));
        }
        let WA = K5();
        if (L && J.model && L === J.model)
          (process.stderr.write(
            iA.red(`Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.
`),
          ),
            process.exit(1));
        let JA = J.systemPrompt;
        if (J.systemPromptFile) {
          if (J.systemPrompt)
            (process.stderr.write(
              iA.red(`Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.
`),
            ),
              process.exit(1));
          try {
            let K0 = G20(J.systemPromptFile);
            if (!V21(K0))
              (process.stderr.write(
                iA.red(`Error: System prompt file not found: ${K0}
`),
              ),
                process.exit(1));
            JA = M09(K0, "utf8");
          } catch (K0) {
            (process.stderr.write(
              iA.red(`Error reading system prompt file: ${K0 instanceof Error ? K0.message : String(K0)}
`),
            ),
              process.exit(1));
          }
        }
        let wA = J.appendSystemPrompt;
        if (J.appendSystemPromptFile) {
          if (J.appendSystemPrompt)
            (process.stderr.write(
              iA.red(`Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.
`),
            ),
              process.exit(1));
          try {
            let K0 = G20(J.appendSystemPromptFile);
            if (!V21(K0))
              (process.stderr.write(
                iA.red(`Error: Append system prompt file not found: ${K0}
`),
              ),
                process.exit(1));
            wA = M09(K0, "utf8");
          } catch (K0) {
            (process.stderr.write(
              iA.red(`Error reading append system prompt file: ${K0 instanceof Error ? K0.message : String(K0)}
`),
            ),
              process.exit(1));
          }
        }
        let { mode: xA, notification: rA } = Sr2({
            permissionModeCli: H,
            dangerouslySkipPermissions: F,
          }),
          qA = void 0;
        if (E && E.length > 0) {
          let K0 = E.map((y1) => y1.trim()).filter((y1) => y1.length > 0),
            F1 = {},
            q1 = [];
          for (let y1 of K0) {
            let g1 = null,
              E0 = [],
              U0 = b3(y1);
            if (U0) {
              let e0 = _HA({
                configObject: U0,
                filePath: "command line",
                expandVars: !0,
                scope: "dynamic",
              });
              if (e0.config) g1 = e0.config.mcpServers;
              else E0 = e0.errors;
            } else {
              let e0 = G20(y1),
                VB = m5A({ filePath: e0, expandVars: !0, scope: "dynamic" });
              if (VB.config) g1 = VB.config.mcpServers;
              else E0 = VB.errors;
            }
            if (E0.length > 0) q1.push(...E0);
            else if (g1) F1 = { ...F1, ...g1 };
          }
          if (q1.length > 0) {
            let y1 = q1.map(
              (g1) => `${g1.path ? g1.path + ": " : ""}${g1.message}`,
            ).join(`
`);
            throw Error(`Invalid MCP configuration:
${y1}`);
          }
          if (Object.keys(F1).length > 0)
            qA = Yr(F1, (y1) => ({ ...y1, scope: "dynamic" }));
        }
        let { toolPermissionContext: SA, warnings: zA } = yr2({
          allowedToolsCli: K,
          disallowedToolsCli: D,
          baseToolsCli: V,
          permissionMode: xA,
          allowDangerouslySkipPermissions: C,
          addDirs: w,
        });
        (zA.forEach((K0) => {
          console.error(K0);
        }),
          R02());
        let { servers: kA } = o ? { servers: {} } : await US(),
          sA = { ...kA, ...qA },
          Z1 = {},
          XA = {};
        for (let [K0, F1] of Object.entries(sA)) {
          let q1 = F1;
          if (q1.type === "sdk") Z1[K0] = q1;
          else XA[K0] = q1;
        }
        if (x && x !== "text" && x !== "stream-json")
          (console.error(`Error: Invalid input format "${x}".`),
            process.exit(1));
        if (x === "stream-json" && b !== "stream-json")
          (console.error(
            "Error: --input-format=stream-json requires output-format=stream-json.",
          ),
            process.exit(1));
        if (c) {
          if (x !== "stream-json" || b !== "stream-json")
            (console.error(
              "Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json.",
            ),
              process.exit(1));
        }
        if (J.replayUserMessages) {
          if (x !== "stream-json" || b !== "stream-json")
            (console.error(
              "Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json.",
            ),
              process.exit(1));
        }
        if (O) {
          if (!WA || b !== "stream-json")
            (JT(
              "Error: --include-partial-messages requires --print and --output-format=stream-json.",
            ),
              process.exit(1));
        }
        if (V.length > 0 && !WA)
          (JT("Error: --tools can only be used with --print mode."),
            process.exit(1));
        let CA = await T6I(Y || "", x ?? "text"),
          UA = Yz(SA);
        await K21(I20(), xA, C, l, $ ? Vz($) : void 0);
        let HA = J.model === "default" ? On() : J.model,
          LA = L === "default" ? On() : L,
          [TA, tA] = await Promise.all([JE(), Hn2()]),
          aA = [];
        if (k)
          try {
            let K0 = b3(k);
            if (K0) aA = zn2(K0, "flagSettings");
          } catch (K0) {
            BA(K0 instanceof Error ? K0 : Error(String(K0)), yMA);
          }
        let W1 = [...tA.allAgents, ...aA],
          w1 = { ...tA, allAgents: W1, activeAgents: Uy(W1) };
        if (!WA) {
          if ((await T09(xA, C, TA)) && Y?.trim().toLowerCase() === "/login")
            Y = "";
        }
        if (process.exitCode !== void 0) {
          g("Graceful shutdown initiated, skipping further initialization");
          return;
        }
        (o0Q().catch((K0) => BA(K0, LZ0)), FzB(), N09(), D19(K5()));
        let OA = QsA(XA),
          I1 = CA || WA ? await OA : { clients: [], tools: [], commands: [] },
          i1 = I1.clients,
          G1 = I1.tools,
          e1 = I1.commands;
        if (
          (GA("tengu_init", {
            entrypoint: "claude",
            hasInitialPrompt: Boolean(Y),
            hasStdin: Boolean(CA),
            verbose: n,
            debug: X,
            debugToStderr: W,
            print: m,
            outputFormat: b,
            inputFormat: x,
            numAllowedTools: K.length,
            numDisallowedTools: D.length,
            mcpClientCount: Object.keys(sA).length,
            worktree: l,
            skipWebFetchPreflight: N0().skipWebFetchPreflight,
            ...(process.env.GITHUB_ACTION_INPUTS && {
              githubActionInputs: process.env.GITHUB_ACTION_INPUTS,
            }),
            dangerouslySkipPermissionsPassed: F ?? !1,
            modeIsBypass: xA === "bypassPermissions",
            allowDangerouslySkipPermissionsPassed: C,
            ...(JA && {
              systemPromptFlag: J.systemPromptFile ? "file" : "flag",
            }),
            ...(wA && {
              appendSystemPromptFlag: J.appendSystemPromptFile
                ? "file"
                : "flag",
            }),
          }),
          qdQ(XA, SA),
          EiA(null, "initialization"),
          E6I(),
          Xl(HA),
          WA)
        ) {
          if (b === "stream-json" || b === "json") v80(!0);
          vQ0();
          let K0 = TA.filter(
              (q1) =>
                (q1.type === "prompt" && !q1.disableNonInteractive) ||
                (q1.type === "local" && q1.supportsNonInteractive),
            ),
            F1 = tg();
          if (
            ((F1 = {
              ...F1,
              mcp: { ...F1.mcp, clients: i1, commands: e1, tools: G1 },
              toolPermissionContext: SA,
            }),
            SA.mode === "bypassPermissions" || C)
          )
            _r2(SA);
          Y09(
            CA,
            async () => F1,
            (q1) => {
              let y1 = F1;
              ((F1 = q1(F1)), vb({ newState: F1, oldState: y1 }));
            },
            K0,
            UA,
            Z1,
            w1.activeAgents,
            {
              continue: J.continue,
              resume: J.resume,
              verbose: n,
              outputFormat: b,
              permissionPromptToolName: J.permissionPromptTool,
              allowedTools: K,
              maxThinkingTokens: J.maxThinkingTokens,
              maxTurns: J.maxTurns,
              maxBudgetUsd: J.maxBudgetUsd,
              systemPrompt: JA,
              appendSystemPrompt: wA,
              userSpecifiedModel: HA,
              fallbackModel: LA,
              teleport: e,
              sdkUrl: c,
              replayUserMessages: J.replayUserMessages,
              includePartialMessages: O,
              forkSession: J.forkSession || !1,
              resumeSessionAt: J.resumeSessionAt || void 0,
              enableAuthStatus: J.enableAuthStatus,
            },
          );
          return;
        }
        let _0 = R6I(!1);
        if (
          (QMQ(),
          GA("tengu_startup_manual_model_config", {
            cli_flag: J.model,
            env_var: process.env.ANTHROPIC_MODEL,
            settings_file: (N0() || {}).model,
            subscriptionType: i3(),
          }),
          L1().hasOpusPlanDefault === void 0)
        )
          n0({
            ...L1(),
            hasOpusPlanDefault: cQ("userSettings")?.model === "opusplan",
          });
        let h0 = J.model || process.env.ANTHROPIC_MODEL || N0().model;
        if (nB() && !xU() && h0 !== void 0 && h0.includes("opus"))
          console.error(
            iA.yellow(
              "Claude Pro users are not currently able to use Opus in Claude Code. The current model is now Sonnet.",
            ),
          );
        J80(ovA() || null);
        let a0 = L0(),
          c0 = {
            backgroundTasks: {},
            verbose: n ?? L1().verbose ?? !1,
            mainLoopModel: ILA(),
            mainLoopModelForSession: null,
            showExpandedTodos: L1().showExpandedTodos ?? !1,
            toolPermissionContext: SA,
            agentDefinitions: w1,
            checkpointing: {
              status: "uninitialized",
              checkpoints: {},
              shadowRepoPath: void 0,
              saveError: void 0,
              saving: !1,
              autocheckpointEnabled: !1,
            },
            mcp: { clients: [], tools: [], commands: [], resources: {} },
            plugins: {
              enabled: [],
              disabled: [],
              commands: [],
              agents: [],
              errors: [],
              installationStatus: { marketplaces: [], plugins: [] },
            },
            statusLineText: void 0,
            notifications: {
              current: null,
              queue: rA
                ? [
                    {
                      key: "permission-mode-notification",
                      text: rA,
                      priority: "high",
                    },
                  ]
                : [],
            },
            elicitation: { queue: [] },
            todos: { [a0]: xx(a0) },
            fileHistory: { snapshots: [], trackedFiles: new Set() },
            thinkingEnabled: WbA(),
            feedbackSurvey: {
              timeLastShown: null,
              submitCountAtLastAppearance: null,
            },
            sessionHooks: {},
          };
        if ((z6I(), J.continue))
          try {
            GA("tengu_continue", {});
            let K0 = await Xc(void 0, void 0);
            if (!K0)
              (console.error("No conversation found to continue"),
                process.exit(1));
            if (!J.forkSession) {
              if (K0.sessionId) (QM(K0.sessionId), await Vy());
            }
            await I5(
              e5.default.createElement(
                H3,
                { initialState: c0, onChangeAppState: vb },
                e5.default.createElement(E7A, {
                  debug: X || W,
                  initialPrompt: CA,
                  commands: [...TA, ...e1],
                  initialTools: G1,
                  initialMessages: K0.messages,
                  initialCheckpoints: K0.checkpoints,
                  initialFileHistorySnapshots: K0.fileHistorySnapshots,
                  mcpClients: i1,
                  dynamicMcpConfig: qA,
                  autoConnectIdeFlag: N,
                  strictMcpConfig: o,
                  appendSystemPrompt: wA,
                }),
              ),
              _0,
            );
          } catch (K0) {
            (BA(K0 instanceof Error ? K0 : Error(String(K0)), NZ0),
              process.exit(1));
          }
        else if (J.resume || e || QA) {
          let K0 = null,
            F1 = void 0,
            q1 = void 0,
            y1 = Vz(J.resume);
          if (QA) {
            GA("tengu_remote_create_session", {
              description_length: String(QA.length),
            });
            let g1 = await LT2(QA, new AbortController().signal);
            if (!g1)
              (GA("tengu_remote_create_session_error", {
                error: "unable_to_create_session",
              }),
                process.stderr.write(
                  iA.red(`Error: Unable to create remote session
`),
                ),
                await P6(1),
                process.exit(1));
            (GA("tengu_remote_create_session_success", { session_id: g1.id }),
              process.stdout.write(`Created remote session: ${g1.title}
`),
              process.stdout.write(`View: https://claude.ai/code/${g1.id}?m=0
`),
              process.stdout.write(`Resume with: claude --teleport ${g1.id}
`),
              await P6(0),
              process.exit(0));
          } else if (e) {
            if (e === !0 || e === "") {
              GA("tengu_teleport_interactive_mode", {});
              let g1 = await w09();
              if (!g1) (await P6(0), process.exit(0));
              K0 = (await MwA(Cb(g1.log), g1.branch)).messages;
            } else if (typeof e === "string") {
              GA("tengu_teleport_resume_session", { mode: "direct" });
              try {
                await b11();
                let g1 = await NT2(e);
                K0 = (await MwA(Cb(g1.log), g1.branch)).messages;
              } catch (g1) {
                if (g1 instanceof TZ)
                  process.stderr.write(
                    g1.formattedMessage +
                      `
`,
                  );
                else
                  (BA(g1 instanceof Error ? g1 : Error(String(g1)), o81),
                    process.stderr
                      .write(`Error: ${g1 instanceof Error ? g1.message : String(g1)}
`));
                await P6(1);
              }
            }
          }
          if (y1) {
            let g1 = y1;
            try {
              let E0 = await Xc(g1, void 0);
              if (!E0)
                (console.error(`No conversation found with session ID: ${g1}`),
                  process.exit(1));
              if (
                ((K0 = E0.messages),
                (F1 = E0.checkpoints),
                (q1 = E0.fileHistorySnapshots),
                !J.forkSession)
              )
                (QM(g1), await Vy());
            } catch (E0) {
              (BA(E0 instanceof Error ? E0 : Error(String(E0)), o81),
                console.error(`Failed to resume session ${g1}`),
                process.exit(1));
            }
          }
          if (Array.isArray(K0))
            await I5(
              e5.default.createElement(
                H3,
                { initialState: c0, onChangeAppState: vb },
                e5.default.createElement(E7A, {
                  debug: X || W,
                  initialPrompt: CA,
                  commands: [...TA, ...e1],
                  initialTools: G1,
                  initialMessages: K0,
                  initialCheckpoints: F1,
                  initialFileHistorySnapshots: q1,
                  mcpClients: i1,
                  dynamicMcpConfig: qA,
                  autoConnectIdeFlag: N,
                  strictMcpConfig: o,
                  appendSystemPrompt: wA,
                }),
              ),
              _0,
            );
          else {
            let g1 = {},
              E0 = await Wy();
            if (!E0.length)
              (console.error("No conversations found to resume"),
                process.exit(1));
            let { unmount: U0 } = await I5(
              e5.default.createElement(nA9, {
                commands: [...TA, ...e1],
                context: g1,
                debug: X || W,
                initialLogs: E0,
                initialTools: G1,
                mcpClients: i1,
                dynamicMcpConfig: qA,
                appState: c0,
                onChangeAppState: vb,
                strictMcpConfig: o,
                systemPrompt: JA,
                appendSystemPrompt: wA,
              }),
              _0,
            );
            g1.unmount = U0;
          }
        } else {
          let K0 = await Cw("startup");
          await I5(
            e5.default.createElement(
              H3,
              { initialState: c0, onChangeAppState: vb },
              e5.default.createElement(E7A, {
                debug: X || W,
                commands: [...TA, ...e1],
                initialPrompt: CA,
                initialTools: G1,
                initialMessages: K0,
                mcpClients: i1,
                dynamicMcpConfig: qA,
                autoConnectIdeFlag: N,
                strictMcpConfig: o,
                systemPrompt: JA,
                appendSystemPrompt: wA,
              }),
            ),
            _0,
          );
        }
      })
      .version(
        `${{ ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues", PACKAGE_URL: "@anthropic-ai/claude-code", README_URL: "https://docs.claude.com/s/claude-code", VERSION: "2.0.42", FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues" }.VERSION} (Claude Code)`,
        "-v, --version",
        "Output the version number",
      ),
    A.addOption(
      new nW(
        "--sdk-url <url>",
        "Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)",
      ).hideHelp(),
    ),
    A.addOption(
      new nW(
        "--teleport [session]",
        "Resume a teleport session, optionally specify session ID",
      ).hideHelp(),
    ),
    A.addOption(
      new nW(
        "--remote <description>",
        "Create a remote session with the given description",
      ).hideHelp(),
    ));
  let B = A.command("mcp")
    .description("Configure and manage MCP servers")
    .helpOption("-h, --help", "Display help for command");
  (B.command("serve")
    .description("Start the Claude Code MCP server")
    .helpOption("-h, --help", "Display help for command")
    .option("-d, --debug", "Enable debug mode", () => !0)
    .option("--verbose", "Override verbose mode setting from config", () => !0)
    .action(async ({ debug: Y, verbose: J }) => {
      let X = I20();
      if ((GA("tengu_mcp_start", {}), !V21(X)))
        (console.error(`Error: Directory ${X} does not exist`),
          process.exit(1));
      try {
        (await K21(X, "default", !1, !1, void 0),
          await A19(X, Y ?? !1, J ?? !1));
      } catch (W) {
        (console.error("Error: Failed to start MCP server:", W),
          process.exit(1));
      }
    }),
    B.command("add <name> <commandOrUrl> [args...]")
      .description(
        `Add an MCP server to Claude Code.

Examples:
  # Add HTTP server:
  claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

  # Add SSE server:
  claude mcp add --transport sse asana https://mcp.asana.com/sse

  # Add stdio server:
  claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY -- npx -y airtable-mcp-server`,
      )
      .option(
        "-s, --scope <scope>",
        "Configuration scope (local, user, or project)",
        "local",
      )
      .option(
        "-t, --transport <transport>",
        "Transport type (stdio, sse, http). Defaults to stdio if not specified.",
      )
      .option(
        "-e, --env <env...>",
        "Set environment variables (e.g. -e KEY=value)",
      )
      .option(
        "-H, --header <header...>",
        'Set WebSocket headers (e.g. -H "X-Api-Key: abc123" -H "X-Custom: value")',
      )
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y, J, X, W) => {
        if (!Y)
          (console.error("Error: Server name is required."),
            console.error("Usage: claude mcp add <name> <command> [args...]"),
            process.exit(1));
        else if (!J)
          (console.error(
            "Error: Command is required when server name is provided.",
          ),
            console.error("Usage: claude mcp add <name> <command> [args...]"),
            process.exit(1));
        try {
          let F = vHA(W.scope),
            C = GaQ(W.transport),
            V = W.transport !== void 0,
            K =
              J.startsWith("http://") ||
              J.startsWith("https://") ||
              J.startsWith("localhost") ||
              J.endsWith("/sse") ||
              J.endsWith("/mcp");
          if (
            (GA("tengu_mcp_add", {
              type: C,
              scope: F,
              source: "command",
              transport: C,
              transportExplicit: V,
              looksLikeUrl: K,
            }),
            C === "sse")
          ) {
            if (!J)
              (console.error("Error: URL is required for SSE transport."),
                process.exit(1));
            let D = W.header ? yc1(W.header) : void 0;
            if (
              (qr(Y, { type: "sse", url: J, headers: D }, F),
              process.stdout
                .write(`Added SSE MCP server ${Y} with URL: ${J} to ${F} config
`),
              D)
            )
              process.stdout.write(`Headers: ${JSON.stringify(D, null, 2)}
`);
          } else if (C === "http") {
            if (!J)
              (console.error("Error: URL is required for HTTP transport."),
                process.exit(1));
            let D = W.header ? yc1(W.header) : void 0;
            if (
              (qr(Y, { type: "http", url: J, headers: D }, F),
              process.stdout
                .write(`Added HTTP MCP server ${Y} with URL: ${J} to ${F} config
`),
              D)
            )
              process.stdout.write(`Headers: ${JSON.stringify(D, null, 2)}
`);
          } else {
            if (!V && K)
              (process.stderr.write(`
Warning: The command "${J}" looks like a URL, but is being interpreted as a stdio server as --transport was not specified.
`),
                process.stderr
                  .write(`If this is an HTTP server, use: claude mcp add --transport http ${Y} ${J}
`),
                process.stderr
                  .write(`If this is an SSE server, use: claude mcp add --transport sse ${Y} ${J}
`));
            let D = V90(W.env);
            (qr(Y, { type: "stdio", command: J, args: X || [], env: D }, F),
              process.stdout
                .write(`Added stdio MCP server ${Y} with command: ${J} ${(X || []).join(" ")} to ${F} config
`));
          }
          (process.stdout.write(`File modified: ${Lw(F)}
`),
            process.exit(0));
        } catch (F) {
          (console.error(F.message), process.exit(1));
        }
      }),
    B.command("remove <name>")
      .description("Remove an MCP server")
      .option(
        "-s, --scope <scope>",
        "Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in",
      )
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y, J) => {
        try {
          if (J.scope) {
            let K = vHA(J.scope);
            (GA("tengu_mcp_delete", { name: Y, scope: K }),
              Pc1(Y, K),
              process.stdout.write(`Removed MCP server ${Y} from ${K} config
`),
              process.stdout.write(`File modified: ${Lw(K)}
`),
              process.exit(0));
          }
          let X = v6(),
            W = L1(),
            { servers: F } = SX("project"),
            C = !!F[Y],
            V = [];
          if (X.mcpServers?.[Y]) V.push("local");
          if (C) V.push("project");
          if (W.mcpServers?.[Y]) V.push("user");
          if (V.length === 0)
            (process.stderr.write(`No MCP server found with name: "${Y}"
`),
              process.exit(1));
          else if (V.length === 1) {
            let K = V[0];
            (GA("tengu_mcp_delete", { name: Y, scope: K }),
              Pc1(Y, K),
              process.stdout.write(`Removed MCP server "${Y}" from ${K} config
`),
              process.stdout.write(`File modified: ${Lw(K)}
`),
              process.exit(0));
          } else
            (process.stderr.write(`MCP server "${Y}" exists in multiple scopes:
`),
              V.forEach((K) => {
                process.stderr.write(`  - ${Nr(K)} (${Lw(K)})
`);
              }),
              process.stderr.write(`
To remove from a specific scope, use:
`),
              V.forEach((K) => {
                process.stderr.write(`  claude mcp remove "${Y}" -s ${K}
`);
              }),
              process.exit(1));
        } catch (X) {
          (process.stderr.write(`${X.message}
`),
            process.exit(1));
        }
      }),
    B.command("list")
      .description("List configured MCP servers")
      .helpOption("-h, --help", "Display help for command")
      .action(async () => {
        GA("tengu_mcp_list", {});
        let { servers: Y } = await US();
        if (Object.keys(Y).length === 0)
          console.log(
            "No MCP servers configured. Use `claude mcp add` to add a server.",
          );
        else {
          console.log(`Checking MCP server health...
`);
          for (let [J, X] of Object.entries(Y)) {
            let W = await O09(J, X);
            if (X.type === "sse") console.log(`${J}: ${X.url} (SSE) - ${W}`);
            else if (X.type === "http")
              console.log(`${J}: ${X.url} (HTTP) - ${W}`);
            else if (!X.type || X.type === "stdio") {
              let F = Array.isArray(X.args) ? X.args : [];
              console.log(`${J}: ${X.command} ${F.join(" ")} - ${W}`);
            }
          }
        }
        process.exit(0);
      }),
    B.command("get <name>")
      .description("Get details about an MCP server")
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y) => {
        GA("tengu_mcp_get", { name: Y });
        let J = d5A(Y);
        if (!J)
          (console.error(`No MCP server found with name: ${Y}`),
            process.exit(1));
        (console.log(`${Y}:`), console.log(`  Scope: ${Nr(J.scope)}`));
        let X = await O09(Y, J);
        if ((console.log(`  Status: ${X}`), J.type === "sse")) {
          if (
            (console.log("  Type: sse"),
            console.log(`  URL: ${J.url}`),
            J.headers)
          ) {
            console.log("  Headers:");
            for (let [W, F] of Object.entries(J.headers))
              console.log(`    ${W}: ${F}`);
          }
        } else if (J.type === "http") {
          if (
            (console.log("  Type: http"),
            console.log(`  URL: ${J.url}`),
            J.headers)
          ) {
            console.log("  Headers:");
            for (let [W, F] of Object.entries(J.headers))
              console.log(`    ${W}: ${F}`);
          }
        } else if (J.type === "stdio") {
          (console.log("  Type: stdio"),
            console.log(`  Command: ${J.command}`));
          let W = Array.isArray(J.args) ? J.args : [];
          if ((console.log(`  Args: ${W.join(" ")}`), J.env)) {
            console.log("  Environment:");
            for (let [F, C] of Object.entries(J.env))
              console.log(`    ${F}=${C}`);
          }
        }
        (console.log(`
To remove this server, run: claude mcp remove "${Y}" -s ${J.scope}`),
          process.exit(0));
      }),
    B.command("add-json <name> <json>")
      .description("Add an MCP server (stdio or SSE) with a JSON string")
      .option(
        "-s, --scope <scope>",
        "Configuration scope (local, user, or project)",
        "local",
      )
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y, J, X) => {
        try {
          let W = vHA(X.scope),
            F = b3(J);
          qr(Y, F, W);
          let C =
            F && typeof F === "object" && "type" in F
              ? String(F.type || "stdio")
              : "stdio";
          (GA("tengu_mcp_add", { scope: W, source: "json", type: C }),
            console.log(`Added ${C} MCP server ${Y} to ${W} config`),
            process.exit(0));
        } catch (W) {
          (console.error(W.message), process.exit(1));
        }
      }),
    B.command("add-from-claude-desktop")
      .description("Import MCP servers from Claude Desktop (Mac and WSL only)")
      .option(
        "-s, --scope <scope>",
        "Configuration scope (local, user, or project)",
        "local",
      )
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y) => {
        try {
          let J = vHA(Y.scope),
            X = EB();
          GA("tengu_mcp_add", { scope: J, platform: X, source: "desktop" });
          let W = MA9();
          if (Object.keys(W).length === 0)
            (console.log(
              "No MCP servers found in Claude Desktop configuration or configuration file does not exist.",
            ),
              process.exit(0));
          let { unmount: F } = await I5(
            e5.default.createElement(
              H3,
              null,
              e5.default.createElement(qA9, {
                servers: W,
                scope: J,
                onDone: () => {
                  F();
                },
              }),
            ),
            { exitOnCtrlC: !0 },
          );
        } catch (J) {
          (console.error(J.message), process.exit(1));
        }
      }),
    B.command("reset-project-choices")
      .description(
        "Reset all approved and rejected project-scoped (.mcp.json) servers within this project",
      )
      .helpOption("-h, --help", "Display help for command")
      .action(async () => {
        GA("tengu_mcp_reset_mcpjson_choices", {});
        let Y = v6();
        (uG({
          ...Y,
          enabledMcpjsonServers: [],
          disabledMcpjsonServers: [],
          enableAllProjectMcpServers: !1,
        }),
          console.log(
            "All project-scoped (.mcp.json) server approvals and rejections have been reset.",
          ),
          console.log(
            "You will be prompted for approval next time you start Claude Code.",
          ),
          process.exit(0));
      }));
  function Q(Y, J) {
    (BA(Y instanceof Error ? Y : Error(String(Y)), Pl),
      console.error(
        `${E1.cross} Failed to ${J}: ${Y instanceof Error ? Y.message : String(Y)}`,
      ),
      process.exit(1));
  }
  let I = A.command("plugin")
    .description("Manage Claude Code plugins")
    .helpOption("-h, --help", "Display help for command");
  I.command("validate <path>")
    .description("Validate a plugin or marketplace manifest")
    .helpOption("-h, --help", "Display help for command")
    .action((Y) => {
      try {
        let J = BQ1(Y);
        if (
          (console.log(`Validating ${J.fileType} manifest: ${J.filePath}
`),
          J.errors.length > 0)
        )
          (console.log(`${E1.cross} Found ${J.errors.length} error${J.errors.length === 1 ? "" : "s"}:
`),
            J.errors.forEach((X) => {
              console.log(`  ${E1.pointer} ${X.path}: ${X.message}`);
            }),
            console.log(""));
        if (J.warnings.length > 0)
          (console.log(`${E1.warning} Found ${J.warnings.length} warning${J.warnings.length === 1 ? "" : "s"}:
`),
            J.warnings.forEach((X) => {
              console.log(`  ${E1.pointer} ${X.path}: ${X.message}`);
            }),
            console.log(""));
        if (J.success) {
          if (J.warnings.length > 0)
            console.log(`${E1.tick} Validation passed with warnings`);
          else console.log(`${E1.tick} Validation passed`);
          process.exit(0);
        } else (console.log(`${E1.cross} Validation failed`), process.exit(1));
      } catch (J) {
        (BA(J instanceof Error ? J : Error(String(J)), Pl),
          console.error(
            `${E1.cross} Unexpected error during validation: ${J instanceof Error ? J.message : String(J)}`,
          ),
          process.exit(2));
      }
    });
  let G = I.command("marketplace")
    .description("Manage Claude Code marketplaces")
    .helpOption("-h, --help", "Display help for command");
  (G.command("add <source>")
    .description("Add a marketplace from a URL, path, or GitHub repo")
    .helpOption("-h, --help", "Display help for command")
    .action(async (Y) => {
      try {
        let J = eB1(Y);
        if (!J)
          (console.error(
            `${E1.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`,
          ),
            process.exit(1));
        if ("error" in J)
          (console.error(`${E1.cross} ${J.error}`), process.exit(1));
        let X = J;
        console.log("Adding marketplace...");
        let { name: W } = await Ds(X, (C) => {
          console.log(C);
        });
        yW();
        let F = X.source;
        if (X.source === "github") F = X.repo;
        (GA("tengu_marketplace_added", { source_type: F }),
          console.log(`${E1.tick} Successfully added marketplace: ${W}`),
          process.exit(0));
      } catch (J) {
        Q(J, "add marketplace");
      }
    }),
    G.command("list")
      .description("List all configured marketplaces")
      .helpOption("-h, --help", "Display help for command")
      .action(async () => {
        try {
          let Y = await PY(),
            J = Object.keys(Y);
          if (J.length === 0)
            (console.log("No marketplaces configured"), process.exit(0));
          (console.log(`Configured marketplaces:
`),
            J.forEach((X) => {
              let W = Y[X];
              if ((console.log(`  ${E1.pointer} ${X}`), W?.source)) {
                let F = W.source;
                if (F.source === "github")
                  console.log(`    Source: GitHub (${F.repo})`);
                else if (F.source === "git")
                  console.log(`    Source: Git (${F.url})`);
                else if (F.source === "url")
                  console.log(`    Source: URL (${F.url})`);
                else if (F.source === "directory")
                  console.log(`    Source: Directory (${F.path})`);
                else if (F.source === "file")
                  console.log(`    Source: File (${F.path})`);
              }
              console.log("");
            }),
            process.exit(0));
        } catch (Y) {
          Q(Y, "list marketplaces");
        }
      }),
    G.command("remove <name>")
      .alias("rm")
      .description("Remove a configured marketplace")
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y) => {
        try {
          (await YiA(Y),
            yW(),
            GA("tengu_marketplace_removed", { marketplace_name: Y }),
            console.log(`${E1.tick} Successfully removed marketplace: ${Y}`),
            process.exit(0));
        } catch (J) {
          Q(J, "remove marketplace");
        }
      }),
    G.command("update [name]")
      .description(
        "Update marketplace(s) from their source - updates all if no name specified",
      )
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y) => {
        try {
          if (Y)
            (console.log(`Updating marketplace: ${Y}...`),
              await JiA(Y, (J) => {
                console.log(J);
              }),
              yW(),
              GA("tengu_marketplace_updated", { marketplace_name: Y }),
              console.log(`${E1.tick} Successfully updated marketplace: ${Y}`),
              process.exit(0));
          else {
            let J = await PY(),
              X = Object.keys(J);
            if (X.length === 0)
              (console.log("No marketplaces configured"), process.exit(0));
            (console.log(`Updating ${X.length} marketplace(s)...`),
              await o$Q(),
              yW(),
              GA("tengu_marketplace_updated_all", { count: X.length }),
              console.log(
                `${E1.tick} Successfully updated ${X.length} marketplace(s)`,
              ),
              process.exit(0));
          }
        } catch (J) {
          Q(J, "update marketplace(s)");
        }
      }),
    I.command("install <plugin>")
      .alias("i")
      .description(
        "Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)",
      )
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y) => {
        (GA("tengu_plugin_install_command", { plugin: Y }), await I19(Y));
      }),
    I.command("uninstall <plugin>")
      .alias("remove")
      .alias("rm")
      .description("Uninstall an installed plugin")
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y) => {
        (GA("tengu_plugin_uninstall_command", { plugin: Y }), await G19(Y));
      }),
    I.command("enable <plugin>")
      .description("Enable a disabled plugin")
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y) => {
        (GA("tengu_plugin_enable_command", { plugin: Y }), await Z19(Y));
      }),
    I.command("disable <plugin>")
      .description("Disable an enabled plugin")
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y) => {
        (GA("tengu_plugin_disable_command", { plugin: Y }), await Y19(Y));
      }),
    A.command("migrate-installer")
      .description("Migrate from global npm installation to local installation")
      .helpOption("-h, --help", "Display help for command")
      .action(async () => {
        if (Bc())
          (console.log(
            "Already running from local installation. No migration needed.",
          ),
            process.exit(0));
        (GA("tengu_migrate_installer_command", {}),
          await new Promise(async (Y) => {
            let { waitUntilExit: J } = await I5(
              e5.default.createElement(
                H3,
                null,
                e5.default.createElement(R7A, null),
              ),
            );
            J().then(() => {
              Y();
            });
          }),
          process.exit(0));
      }),
    A.command("setup-token")
      .description(
        "Set up a long-lived authentication token (requires Claude subscription)",
      )
      .helpOption("-h, --help", "Display help for command")
      .action(async () => {
        if ((GA("tengu_setup_token_command", {}), await NY(), !Sz()))
          (process.stderr.write(
            iA.yellow(`Warning: You already have authentication configured via environment variable or API key helper.
`),
          ),
            process.stderr.write(
              iA.yellow(`The setup-token command will create a new OAuth token which you can use instead.
`),
            ));
        (await new Promise(async (Y) => {
          let { unmount: J } = await I5(
            e5.default.createElement(
              H3,
              { onChangeAppState: vb },
              e5.default.createElement(
                S,
                { flexDirection: "column", gap: 1 },
                e5.default.createElement(
                  kh,
                  {
                    items: [e5.default.createElement(Z21, { key: "welcome" })],
                  },
                  (X) => X,
                ),
                e5.default.createElement(dc, {
                  onDone: () => {
                    (J(), Y());
                  },
                  mode: "setup-token",
                  startingMessage:
                    "This will guide you through long-lived (1-year) auth token setup for your Claude account. Claude subscription required.",
                }),
              ),
            ),
          );
        }),
          process.exit(0));
      }));
  function Z({ onDone: Y }) {
    return (B01(), e5.default.createElement(r01, { onDone: Y }));
  }
  return (
    A.command("doctor")
      .description("Check the health of your Claude Code auto-updater")
      .helpOption("-h, --help", "Display help for command")
      .action(async () => {
        (GA("tengu_doctor_command", {}),
          await new Promise(async (Y) => {
            let { unmount: J } = await I5(
              e5.default.createElement(
                H3,
                null,
                e5.default.createElement(
                  ftA,
                  { dynamicMcpConfig: void 0, isStrictMcpConfig: !1 },
                  e5.default.createElement(Z, {
                    onDone: () => {
                      (J(), Y());
                    },
                  }),
                ),
              ),
              { exitOnCtrlC: !1 },
            );
          }),
          process.exit(0));
      }),
    A.command("update")
      .description("Check for updates and install if available")
      .helpOption("-h, --help", "Display help for command")
      .action(W09),
    A.command("install [target]")
      .description(
        "Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)",
      )
      .option("--force", "Force installation even if already installed")
      .helpOption("-h, --help", "Display help for command")
      .action(async (Y, J) => {
        (await K21(I20(), "default", !1, !1, void 0),
          await new Promise((X) => {
            let W = [];
            if (Y) W.push(Y);
            if (J.force) W.push("--force");
            V09.call(
              () => {
                (X(), process.exit(0));
              },
              {},
              W,
            );
          }));
      }),
    JI("run_before_parse"),
    await A.parseAsync(process.argv),
    JI("run_after_parse"),
    g80(),
    A
  );
}
function j6I() {
  (process.stderr.isTTY
    ? process.stderr
    : process.stdout.isTTY
      ? process.stdout
      : void 0
  )?.write(`\x1B[?25h${EY1}`);
}
var e5;
var j09 = T(() => {
  WLA();
  be2();
  ne2();
  se2();
  F2();
  C6();
  Us();
  bQ0();
  GA9();
  XA9();
  CA9();
  vm1();
  FsA();
  nA();
  P01();
  ZS();
  X01();
  o91();
  nO();
  f2();
  NA9();
  OA9();
  UFA();
  E5();
  kB();
  F2();
  w$A();
  iIA();
  jJ1();
  PJ1();
  c1();
  E7();
  La();
  E7();
  jA9();
  $wA();
  nA0();
  Pe1();
  mQ0();
  lA9();
  DB1();
  gA0();
  lD();
  Y9();
  OQ();
  iA9();
  aA9();
  B19();
  e00();
  vB();
  Gz();
  x$A();
  tDA();
  a00();
  pD();
  Ht();
  d00();
  J19();
  s2();
  C19();
  vC();
  E19();
  vB();
  wC();
  Tv();
  rl1();
  E7();
  vG();
  uv1();
  j19();
  OQ();
  f4();
  H0();
  H0();
  Xe1();
  YJA();
  PIA();
  WR();
  FR();
  Xx();
  S19();
  MM();
  k19();
  gj();
  OIA();
  uT();
  dIA();
  Ps();
  xj();
  i0();
  c9();
  Io();
  _19();
  _m();
  fm();
  i0();
  C0();
  v19();
  f19();
  g19();
  m19();
  c19();
  DbA();
  J09();
  F09();
  c4A();
  Q5();
  K09();
  lo();
  $09();
  kH();
  xY();
  y7();
  aN();
  kF();
  gx1();
  m0();
  xj();
  V2();
  uB1();
  PwA();
  de1();
  NC();
  dQ0();
  G7A();
  wv();
  L09();
  e5 = IA(KA(), 1);
  JI("main_tsx_entry");
  JI("main_tsx_imports_loaded");
  if (H6I()) process.exit(1);
});
WLA();
C0();
ez();
o91();
vGA();
f2();
gj();
UD();
kB();
f4();
H0();
kF();
import { readFileSync as _Q0, existsSync as Re2 } from "fs";
function RqA() {
  try {
    let A = xGA(),
      B = _Q0(A, "utf-8");
    return JSON.parse(B);
  } catch {
    (console.error(iA.red("Error: MCP state not available")),
      console.error(
        "The mcp command is only available within a Claude Code session",
      ),
      process.exit(1));
  }
}
function Te2(A, B) {
  if (A.configs?.[B]) return A.configs[B];
  let Q = A.normalizedNames?.[B];
  if (Q && A.configs?.[Q]) return A.configs[Q];
  return;
}
function Pe2(A, B) {
  if (A.resources?.[B]) return A.resources[B];
  let Q = A.normalizedNames?.[B];
  if (Q && A.resources?.[Q]) return A.resources[Q];
  return [];
}
function xQ0(A) {
  let B = A.split("/");
  if (B.length !== 2 || !B[0] || !B[1])
    (console.error(iA.red(`Error: Invalid tool identifier '${A}'`)),
      console.error("Expected format: <server>/<tool>"),
      process.exit(1));
  return { server: B[0], tool: B[1] };
}
var Kp = new CLA()
  .name("mcp-cli")
  .description("Interact with MCP servers and tools")
  .version("1.0.0");
Kp.command("servers")
  .description("List all connected MCP servers")
  .option("--json", "Output in JSON format")
  .action(async (A) => {
    let B = RqA();
    if (A.json)
      console.log(
        JSON.stringify(
          B.clients.map((Q) => ({
            name: x3(Q.name),
            type: Q.type,
            hasTools: Q.type === "connected" && !!Q.capabilities?.tools,
            hasResources: Q.type === "connected" && !!Q.capabilities?.resources,
          })),
        ),
      );
    else
      B.clients.forEach((Q) => {
        let I =
            Q.type === "connected"
              ? iA.green("connected")
              : Q.type === "failed"
                ? iA.red("failed")
                : iA.yellow(Q.type),
          G = "";
        if (Q.type === "connected") {
          let Y = [];
          if (Q.capabilities?.tools) Y.push("tools");
          if (Q.capabilities?.resources) Y.push("resources");
          if (Q.capabilities?.prompts) Y.push("prompts");
          if (Y.length > 0) G = ` (${Y.join(", ")})`;
        }
        let Z = x3(Q.name);
        console.log(`${Z} - ${I}${G}`);
      });
    await BD("tengu_mcp_cli_command_executed", {
      command: "servers",
      server_count: B.clients.length,
    });
  });
Kp.command("tools")
  .description("List all available tools")
  .argument("[server]", "Filter by server name")
  .option("--json", "Output in JSON format")
  .action(async (A, B) => {
    let I = RqA().tools;
    if (A) {
      let G = `mcp__${x3(A)}__`;
      I = I.filter((Z) => Z.name.startsWith(G));
    }
    if (B.json) {
      let G = I.map((Z) => {
        let Y = ZE(Z.name);
        return {
          server: Y?.serverName || "unknown",
          name: Y?.toolName || Z.name,
          description: typeof Z.description === "function" ? "" : Z.description,
        };
      });
      console.log(JSON.stringify(G));
    } else if (A)
      I.forEach((G) => {
        let Y = ZE(G.name)?.toolName || G.name;
        console.log(`${Y}`);
      });
    else
      I.forEach((G) => {
        let Z = ZE(G.name),
          Y = Z?.serverName || "unknown",
          J = Z?.toolName || G.name;
        console.log(`${Y}/${J}`);
      });
    await BD("tengu_mcp_cli_command_executed", {
      command: "tools",
      tool_count: I.length,
      filtered: !!A,
    });
  });
Kp.command("info")
  .description("Get detailed information about a tool")
  .argument("<tool>", "Tool identifier in format <server>/<tool>")
  .option("--json", "Output in JSON format")
  .action(async (A, B) => {
    let Q = RqA(),
      { server: I, tool: G } = xQ0(A),
      Z = `mcp__${x3(I)}__${x3(G)}`,
      Y = Q.tools.find((X) => X.name === Z);
    if (!Y)
      (console.error(iA.red(`Error: Tool '${A}' not found`)),
        await BD("tengu_mcp_cli_command_executed", {
          command: "info",
          tool_found: !1,
        }),
        process.exit(1));
    let J = typeof Y.description === "string" ? Y.description : "";
    if (B.json)
      console.log(
        JSON.stringify({
          server: I,
          name: G,
          description: J,
          inputSchema: Y.inputJSONSchema || {},
        }),
      );
    else {
      if (
        (console.log(iA.bold(`Tool: ${A}`)),
        console.log(iA.dim(`Server: ${I}`)),
        J)
      )
        console.log(iA.dim(`Description: ${J}`));
      (console.log(),
        console.log(iA.bold("Input Schema:")),
        console.log(JSON.stringify(Y.inputJSONSchema || {}, null, 2)));
    }
    await BD("tengu_mcp_cli_command_executed", {
      command: "info",
      tool_found: !0,
    });
  });
Kp.command("call")
  .description("Invoke an MCP tool")
  .argument("<tool>", "Tool identifier in format <server>/<tool>")
  .argument("<args>", 'Tool arguments as JSON string or "-" for stdin')
  .option("--json", "Output in JSON format")
  .option("--timeout <ms>", "Timeout in milliseconds", "30000")
  .option("--debug", "Show debug output")
  .action(async (A, B, Q) => {
    let { server: I, tool: G } = xQ0(A);
    if (B === "-") {
      let C = [];
      for await (let V of process.stdin) C.push(V);
      B = Buffer.concat(C).toString("utf-8").trim();
    }
    let Z;
    try {
      Z = JSON.parse(B);
    } catch (C) {
      (console.error(iA.red("Error: Invalid JSON arguments")),
        console.error(String(C)),
        process.exit(1));
    }
    let Y = xGA();
    if (!Re2(Y))
      (console.error(
        iA.red("Error: MCP state file not found. Is Claude Code running?"),
      ),
        process.exit(1));
    let J;
    try {
      J = JSON.parse(_Q0(Y, "utf-8"));
    } catch (C) {
      (console.error(iA.red("Error reading MCP state:"), String(C)),
        process.exit(1));
    }
    let X = Te2(J, I);
    if (!X)
      (console.error(iA.red(`Error: Server '${I}' not found in state`)),
        process.exit(1));
    if (Q.debug) console.error(`Connecting to ${I} (${X.type})...`);
    let W = Date.now(),
      F = `mcp__${x3(I)}__${x3(G)}`;
    try {
      let C = await Qo(I, X);
      if (C.client.type !== "connected") {
        console.error(
          iA.red(
            `Error: Failed to connect to server '${I}' (status: ${C.client.type})`,
          ),
        );
        let E = Date.now() - W;
        (await BD("tengu_tool_use_error", {
          toolName: F,
          isMcp: !0,
          error: "connection_failed",
          durationMs: E,
        }),
          await BD("tengu_mcp_cli_command_executed", {
            command: "call",
            tool_name: F,
            success: !1,
            error_type: "connection_failed",
            duration_ms: E,
          }),
          process.exit(1));
      }
      if (Q.debug) console.error(`Calling tool ${G}...`);
      let V = (() => {
          let E = J.normalizedNames?.[I] || I,
            H = `mcp__${x3(E)}__${x3(G)}`;
          return J.tools.find((L) => L.name === H)?.originalToolName || G;
        })(),
        K = await C.client.client.callTool({ name: V, arguments: Z }, vf, {
          signal: AbortSignal.timeout(parseInt(Q.timeout, 10)),
        });
      if ((C.client.client.close(), Q.json)) console.log(JSON.stringify(K));
      else if (typeof K === "string") console.log(K);
      else console.log(JSON.stringify(K, null, 2));
      let D = Date.now() - W;
      (await BD("tengu_tool_use_success", {
        toolName: F,
        isMcp: !0,
        durationMs: D,
      }),
        await BD("tengu_mcp_cli_command_executed", {
          command: "call",
          tool_name: F,
          success: !0,
          duration_ms: D,
        }),
        process.exit(0));
    } catch (C) {
      console.error(iA.red("Error calling tool:"), String(C));
      let V = Date.now() - W,
        K = String(C).slice(0, 2000);
      (await BD("tengu_tool_use_error", {
        toolName: F,
        isMcp: !0,
        error: K,
        durationMs: V,
      }),
        await BD("tengu_mcp_cli_command_executed", {
          command: "call",
          tool_name: F,
          success: !1,
          error_type: "tool_execution_failed",
          duration_ms: V,
        }),
        process.exit(1));
    }
  });
Kp.command("grep")
  .description("Search tool names and descriptions using regex patterns")
  .argument("<pattern>", "Regex pattern to search for")
  .option("--json", "Output in JSON format")
  .option("-i, --ignore-case", "Case insensitive search (default: true)", !0)
  .action(async (A, B) => {
    let Q = RqA(),
      I;
    try {
      I = new RegExp(A, B.ignoreCase ? "i" : "");
    } catch (Z) {
      (console.error(iA.red("Error: Invalid regex pattern")),
        console.error(String(Z)),
        process.exit(1));
    }
    let G = Q.tools.filter((Z) => {
      let Y = typeof Z.description === "string" ? Z.description : "",
        J = ZE(Z.name),
        X = J ? `${J.serverName}/${J.toolName}` : Z.name;
      return I.test(X) || I.test(Y);
    });
    if (B.json) {
      let Z = G.map((Y) => {
        let J = ZE(Y.name);
        return {
          server: J?.serverName || "unknown",
          name: J?.toolName || Y.name,
          description: typeof Y.description === "string" ? Y.description : "",
        };
      });
      console.log(JSON.stringify(Z));
    } else {
      if (G.length === 0)
        (console.log(iA.yellow("No tools found matching pattern")),
          process.exit(0));
      G.forEach((Z) => {
        let Y = ZE(Z.name),
          J = Y?.serverName || "unknown",
          X = Y?.toolName || Z.name,
          W = typeof Z.description === "string" ? Z.description : "";
        if ((console.log(iA.bold(`${J}/${X}`)), W)) {
          let F = W.length > 100 ? W.slice(0, 100) + "..." : W;
          console.log(iA.dim(`  ${F}`));
        }
        console.log();
      });
    }
    await BD("tengu_mcp_cli_command_executed", {
      command: "grep",
      match_count: G.length,
    });
  });
Kp.command("resources")
  .description("List MCP resources")
  .argument("[server]", "Filter by server name")
  .option("--json", "Output in JSON format")
  .action(async (A, B) => {
    let Q = RqA(),
      I = [];
    if (A) I = Pe2(Q, A);
    else I = Object.values(Q.resources).flat();
    if (B.json) {
      let G = I.map((Z) => ({ ...Z, server: x3(Z.server) }));
      console.log(JSON.stringify(G));
    } else
      I.forEach((G) => {
        let Z = x3(G.server);
        console.log(`${Z}/${G.name || G.uri}`);
      });
    await BD("tengu_mcp_cli_command_executed", {
      command: "resources",
      resource_count: I.length,
      filtered: !!A,
    });
  });
Kp.command("read")
  .description("Read an MCP resource")
  .argument(
    "<resource>",
    "Resource identifier in format <server>/<resource> or <server> <uri>",
  )
  .argument("[uri]", "Optional: Direct resource URI (file://, https://, etc.)")
  .option("--json", "Output in JSON format")
  .option("--timeout <ms>", "Timeout in milliseconds", "30000")
  .option("--debug", "Show debug output")
  .action(async (A, B, Q) => {
    let I, G, Z;
    if (B) ((I = A), (Z = B));
    else {
      let C = xQ0(A);
      ((I = C.server), (G = C.tool));
    }
    let Y = xGA();
    if (!Re2(Y))
      (console.error(
        iA.red("Error: MCP state file not found. Is Claude Code running?"),
      ),
        process.exit(1));
    let J;
    try {
      J = JSON.parse(_Q0(Y, "utf-8"));
    } catch (C) {
      (console.error(iA.red("Error reading MCP state:"), String(C)),
        process.exit(1));
    }
    let X = Te2(J, I);
    if (!X)
      (console.error(iA.red(`Error: Server '${I}' not found in state`)),
        process.exit(1));
    let W;
    if (Z) {
      if (((W = Z), Q.debug)) console.log(`Using direct URI: ${W}`);
    } else {
      let V = Pe2(J, I).find((K) => K.name === G || K.uri === G);
      if (!V)
        (console.error(
          iA.red(`Error: Resource '${G}' not found on server '${I}'`),
        ),
          process.exit(1));
      W = V.uri;
    }
    if (Q.debug)
      (console.log(`Connecting to ${I} (${X.type})...`),
        console.log(`Reading resource: ${W}`));
    let F = Date.now();
    try {
      if (Q.debug)
        (console.error(`Attempting to reconnect to ${I}...`),
          console.error(`Config type: ${X.type}`));
      let C = await Qo(I, X);
      if (Q.debug) console.error(`Connection result type: ${C.client.type}`);
      if (C.client.type !== "connected") {
        if (
          (console.error(
            iA.red(
              `Error: Failed to connect to server '${I}' (status: ${C.client.type})`,
            ),
          ),
          C.client.type === "failed" && C.client.error)
        )
          console.error(iA.red(`Details: ${C.client.error}`));
        (await BD("tengu_mcp_cli_command_executed", {
          command: "read",
          success: !1,
          error_type: "connection_failed",
          duration_ms: Date.now() - F,
        }),
          process.exit(1));
      }
      if (Q.debug) console.error("Reading resource...");
      let V = await C.client.client.readResource(
        { uri: W },
        { signal: AbortSignal.timeout(parseInt(Q.timeout, 10)) },
      );
      if ((C.client.client.close(), Q.json)) console.log(JSON.stringify(V));
      else if (V.contents && Array.isArray(V.contents))
        V.contents.forEach((K) => {
          if ("text" in K) console.log(K.text);
          else if ("blob" in K)
            (console.log(iA.yellow("[Binary blob content]")),
              console.log(iA.dim(`MIME type: ${K.mimeType || "unknown"}`)));
        });
      else console.log(JSON.stringify(V, null, 2));
      (await BD("tengu_mcp_cli_command_executed", {
        command: "read",
        success: !0,
        duration_ms: Date.now() - F,
      }),
        process.exit(0));
    } catch (C) {
      (console.error(iA.red("Error reading resource:"), String(C)),
        await BD("tengu_mcp_cli_command_executed", {
          command: "read",
          success: !1,
          error_type: "read_failed",
          duration_ms: Date.now() - F,
        }),
        process.exit(1));
    }
  });
async function je2(A) {
  (RQ1(), TL());
  try {
    return (
      await Kp.parseAsync(A, { from: "user" }),
      await (await TL())?.flush(),
      0
    );
  } catch (B) {
    return (console.error(iA.red("Error:"), B), await (await TL())?.flush(), 1);
  }
}
process.env.COREPACK_ENABLE_AUTO_PIN = "0";
JI("cli_entry");
JI("cli_imports_loaded");
async function S6I() {
  if (eJ() && process.argv[2] === "--mcp-cli") {
    let B = process.argv.slice(3);
    process.exit(await je2(B));
  }
  if (process.argv[2] === "--ripgrep") {
    JI("cli_ripgrep_path");
    let B = process.argv.slice(3),
      { ripgrepMain: Q } = await Promise.resolve().then(() => (ye2(), Se2));
    process.exitCode = Q(B);
    return;
  }
  JI("cli_before_main_import");
  let { main: A } = await Promise.resolve().then(() => (j09(), P09));
  (JI("cli_after_main_import"), await A(), JI("cli_after_main_complete"));
}
S6I();
