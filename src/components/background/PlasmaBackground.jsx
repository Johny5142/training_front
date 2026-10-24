import { useEffect, useRef } from 'react'

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision highp float;

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_grain u_finish.w
#define u_seed u_transform.x

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

vec3 palette(float value) {
  value = clamp(value, 0.0, 1.0) * 3.0;
  vec3 first = mix(u_colors[0], u_colors[1], smoothstep(0.0, 1.0, value));
  vec3 second = mix(u_colors[1], u_colors[2], smoothstep(0.0, 1.0, value - 1.0));
  vec3 third = mix(u_colors[2], u_colors[3], smoothstep(0.0, 1.0, value - 2.0));
  return value < 1.0 ? first : (value < 2.0 ? second : third);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  p *= u_scale;
  p += vec2(sin(u_time * 0.23), cos(u_time * 0.17)) * 0.16;
  p += (vec2(fbm(p * u_detail + u_seed), fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5) * 0.16;

  float k = 2.0 + u_intensity * 6.0;
  float plasma = sin(p.x * k + u_time) + sin(p.y * k * 0.8 - u_time * 0.7)
    + sin((p.x + p.y) * k * 0.6 + u_time * 0.5) + sin(length(p) * k * 1.2 - u_time);
  vec3 color = palette(0.5 + 0.5 * sin(plasma + u_seed));

  color = (color - 0.5) * u_contrast + 0.5;
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luminance), color, u_saturation) + u_brightness;
  float vignette = length(uv - 0.5) * 1.4142;
  color *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vignette);
  float grain = hash21(gl_FragCoord.xy + u_seed * 17.0) - 0.5;
  color += grain * u_grain;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function PlasmaBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return undefined

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return undefined

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, 'a_position')
    const uniforms = {
      colors: gl.getUniformLocation(program, 'u_colors'),
      scene: gl.getUniformLocation(program, 'u_scene'),
      shape: gl.getUniformLocation(program, 'u_shape'),
      surface: gl.getUniformLocation(program, 'u_surface'),
      finish: gl.getUniformLocation(program, 'u_finish'),
      transform: gl.getUniformLocation(program, 'u_transform'),
    }
    const colors = new Float32Array([
      0.965, 0.98, 1.0, // #f7fbff
      0.84, 0.91, 0.97, // #d6e8f7
      0.114, 0.608, 0.941, // #1d9bf0
      0.557, 0.804, 0.973, // #8ecdf8
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ])
    let frameId
    let startTime = performance.now()
    let isVisible = !document.hidden

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const render = (now) => {
      if (!isVisible) return
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      gl.uniform3fv(uniforms.colors, colors)
      gl.uniform4f(uniforms.scene, canvas.width, canvas.height, (now - startTime) * 0.001 * 0.86, 4)
      gl.uniform4f(uniforms.shape, 1.5, 0.48, 0.5, 0.0)
      gl.uniform4f(uniforms.surface, 1.5, 0.72, 0.08, 0.48)
      gl.uniform4f(uniforms.finish, 174.0 * Math.PI / 180.0, 0.2, 0.008, 0.018)
      gl.uniform4f(uniforms.transform, 7.0, 0.0, 0.16, 0.0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frameId = requestAnimationFrame(render)
    }

    const handleVisibility = () => {
      isVisible = !document.hidden
      if (isVisible) {
        startTime = performance.now()
        frameId = requestAnimationFrame(render)
      } else {
        cancelAnimationFrame(frameId)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)
    frameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  return <canvas ref={canvasRef} className="plasma-background" aria-hidden="true" />
}
