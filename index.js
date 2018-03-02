/**
 * 生成svg圆形进度条
 * @Author: qiqislh
 * @Date: 2018-03-01 16:46:36
 * @Last Modified by: qiqislh
 * @Last Modified time: 2018-03-02 10:57:20
 *
 * @param {element} element 插入的位置，默认body
 * @param {float} percent 百分比，默认0
 * @param {int} width svg宽度，默认200
 * @param {int} height svg高度，默认200
 * @param {int} strokeWidth 圆的边宽，默认7
 * @param {int} r 圆半径，默认通过svg宽高及圆的变宽计算
 * @param {string} rotate 进度起始位置，默认'rotate(-90, 0, 0)'，也就是12点方向
 * @param {*} color 进度条的颜色，默认'#05d57f'
 * @param {*} bgColor 进度条背景颜色，默认'#f1f1f1'
*/

class SvgProgress {
  constructor (options) {
    options = options || {}
    this.element = document.querySelector(options.element) || document.body
    // 百分比
    this.percent = options.percent || 20

    this.width = options.width || 200
    this.height = options.height || 200

    // 坐标默认中间，不可修改
    this.cx = parseInt(this.width / 2)
    this.cy = parseInt(this.width / 2)

    // 进度条宽度
    this.strokeWidth = options.strokeWidth || 7

    // 半径：如果没有传入，则通过计算长宽的大小计算最大半径
    this.r = options.r || this.cx >= this.cy ? (this.cx - this.strokeWidth) : (this.cy - this.strokeWidth)

    // 周长
    this.perimeter = parseInt(2 * Math.PI * this.r)

    // 默认起点在顶点
    this.rotate = options.rotate || 'rotate(-90, 0, 0)'

    // 颜色
    this.color = options.color || '#05d57f'
    this.bgColor = options.bgColor || '#f1f1f1'
    this.svg = null
    this.circleActive = null
    this.text = null
    this.render()
  }
  /**
   * 渲染
  */
  render () {
    this.svg = this.generateSvg()
    const g = this.generateG()
    const strokeDasharray = `${this.perimeter} ${this.perimeter}`
    const circleBg = this.generateCircle(this.bgColor, strokeDasharray)
    g.appendChild(circleBg)

    this.circleActive = this.generateCircle(this.color, this.strokeDasharrayActive())
    g.appendChild(this.circleActive)
    // 如果进度为0，隐藏那啥
    if (this.percent <= 0) {
      this.circleActive.style.opacity = 0
    }

    this.text = this.gererateText()
    this.svg.appendChild(g)
    this.svg.appendChild(this.text)
    this.element.appendChild(this.svg)
  }
  /**
   * 更新svg进度
  */
  update () {
    if (this.percent <= 0) {
      this.circleActive.style.opacity = 0
    } else {
      this.circleActive.style.opacity = 1
    }
    this.circleActive.setAttribute('stroke-dasharray', this.strokeDasharrayActive())
    this.text.innerHTML = `${this.percent}%`
  }
  /**
   * 生成进度值
  */
  strokeDasharrayActive () {
    const activeNum = parseInt(this.percent / 100 * this.perimeter)
    const strokeDasharrayActive = `${activeNum} ${this.perimeter}`
    return strokeDasharrayActive
  }
  /**
   * 创建svg
  */
  generateSvg () {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', this.width)
    svg.setAttribute('height', this.height)
    return svg
  }
  /**
   * 创建g
  */
  generateG () {
    let g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('transform', this.rotate)
    g.setAttribute('transform-origin', 'center')
    g.setAttribute('stroke-width', this.strokeWidth)
    g.setAttribute('fill', 'none')
    g.setAttribute('stroke-linecap', 'round')
    return g
  }
  /**
   * 创建圆
   * @param {*} color 圆边框颜色
   * @param {*} strokeDasharray 圆进度
   */
  generateCircle (color, strokeDasharray) {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', this.cx)
    circle.setAttribute('cy', this.cy)
    circle.setAttribute('r', this.r)
    circle.setAttribute('stroke', color)
    circle.setAttribute('stroke-dasharray', strokeDasharray)
    // circle.style.transition = 'all .5s'
    return circle
  }
  /**
   * 创建文字
  */
  gererateText () {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', this.cx)
    text.setAttribute('y', this.cy)
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-size', 12)
    text.setAttribute('stroke', '#000000')
    text.innerHTML = `${this.percent}%`
    return text
  }
}

export default SvgProgress
