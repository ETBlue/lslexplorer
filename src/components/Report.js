import React from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import { Progress } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { StepSet } from '../settings/Step'
import { EvalResult } from '../settings/Logic'

const Detail = ({data}) => {
  const detail = data.map((entry, index) => {
    const parsed = entry.conditionMsg && entry.conditionMsg.map((msg, key) => {
      const preparsed = entry.preconditionMsg && entry.preconditionMsg.map((premsg, prekey) => {
        return (`${premsg.target} ${premsg.logic} ${premsg.ideal}`)
      }).join(` ${entry.preconditionLogic} `)
      let precondition = ''
      if (preparsed) {
        precondition = (
          <p style={{fontSize: '0.8em', opacity: '0.8', lineHeight: '1.2em', margin: '0.5em 0', color: 'rgba(0,0,0,0.8)'}}>
          <span className='ui horizontal divider' style={{fontSize: '1em'}} >
          本規則啟動條件
          </span>
          {preparsed}
          </p>
        )
      }
      const result = EvalResult[msg.result]
      let rowStyle
      switch (msg.result) {
        case 'unsure':
          rowStyle = 'warning'
          break
        case true:
          rowStyle = 'positive'
          break
        case false:
          rowStyle = 'negative'
          break
        default:
      }
      return (
        <tr key={key} className={`${rowStyle} top aligned`} >
          <td>
          <Link to={msg.target}>
          {msg.target}
          </Link>
          </td>
          <td className='center aligned'>
          {msg.logic} {msg.ideal}
          <p style={{fontSize: '0.8em', opacity: '0.8', lineHeight: '1.2em', margin: '0.5em 0'}}>
          {msg.formula}
          </p>
          {precondition}
          </td>
          <td className='center aligned'>
          {msg.reality}
          </td>
          <td className='right aligned'>
          {result}
          </td>
        </tr>
      )
    })
    let logic
    switch (entry.conditionLogic) {
      case '&&':
        logic = '同時'
        break
      case '||':
        logic = '擇一'
        break
      default:
    }
    const paragraph = entry.paragraph && entry.paragraph.toString()
    const subParagraph = entry.subparagraph && entry.subparagraph.toString()
    const item = entry.item && entry.item.toString()
    let description = (
      <th colSpan='4' >
      根據{entry.law}（{entry.version} 版）
      {paragraph && paragraph.length > 0 ? `第 ${paragraph.split(';').join('、')} 條` : '' }
      {subParagraph && subParagraph.length > 0 ? `第 ${subParagraph.split(';').join('、')} 項` : ''}
      {item && item.length > 0 ? `第 ${item.split(';').join('、')} 款` : ''}
      ，需{logic}通過以下規則：
      </th>
    )
    let result, color
    switch (entry.result) {
      case 'unsure':
        result = (<span><i className='icon help circle'></i>無法判斷</span>)
        color = 'yellow'
        break
      case true:
        result = (<span><i className='icon green check square'></i>合格</span>)
        color = 'green'
        break
      case false:
        result = (<span><i className='icon red warning sign'></i>不合格</span>)
        color = 'red'
        break
      default:
    }
    return (
      <table key={index} className={`ui very basic very compact ${color} table`} >
        <thead>
          <tr className='center aligned'>
            {description}
          </tr>
        </thead>
        <tbody>
          <tr style={{fontSize: '0.8rem', fontWeight: 'bold'}} >
            <td className='five wide'>
            規則
            </td>
            <td className='five wide center aligned'>
            理想
            </td>
            <td className='three wide center aligned'>
            現實
            </td>
            <td className='three wide right aligned'>
            結果
            </td>
          </tr>
        {parsed}
        </tbody>
        <tfoot>
          <tr className='center aligned'>
            <th colSpan='4'>
            掃描結果：{result}
            </th>
          </tr>
        </tfoot>
      </table>
    )
  })
  return (
    <div>
    {detail}
    </div>
    )
}

const stepset = Object.keys(StepSet).map((set) => {
  let color = '', icon = 'remove'
  if (set === 'basic') {
    color = 'black'
    icon = 'check'
  }
  return (
    <span key={set} className={`ui horizontal ${color} label`} style={{margin: '0 0.5em'}} >
      <i className={`icon ${icon}`}></i>
      {StepSet[set]}
    </span>
  )
})

const Report = ({report}) => {
  return (
    <section className='Report' style={{textAlign: 'center'}} >
      <header style={{backgroundImage: 'linear-gradient(#e5fffe, rgba(229,255,254,0))'}}>
        <Progress value={1} total={1} size='tiny' color='teal' />
        <h1 className='ui header'>掃描結果</h1>
        <hr className='ui hidden divider' />
        <p>
          掃描
          {stepset}
          後發現：
        </p>
        <p>
          你的工作規定共有
          <span className='ui horizontal red label' style={{margin: '0 0.5rem'}} >
          {report.failed.length}
          </span>
          項不合格、
          <span className='ui horizontal green label' style={{margin: '0 0.5rem'}} >
          {report.passed.length}
          </span>
          項合格、{report.unsure.length} 項目前無法判斷
        </p>
        <p>
          其他掃描規則中另有 {report.na.length} 項確定不適用、以及 {report.maybeNa.length} 項可能不適用
        </p>
        <hr className='ui hidden divider' />
      </header>
      <h2 className='ui icon header'>
        <i className='icon red warning sign'></i>
        不合格
      </h2>
      <hr className='ui hidden divider' />
      {<Detail data={report.failed} />}
      <hr className='ui hidden divider' />
      <h2 className='ui icon header'>
        <i className='icon green check square' style={{fontSize: '4.5rem'}}></i>
        合格
      </h2>
      <hr className='ui hidden divider' />
      {<Detail data={report.passed} />}
      <hr className='ui hidden divider' />
      <h2 className='ui icon header'>
        <i className='icon help circle'></i>
        無法判斷
      </h2>
      <hr className='ui hidden divider' />
      {<Detail data={report.unsure} />}
      <hr className='ui hidden section divider' />
      <Link to='/' className='ui button'>
        重來一次
        <i className='icon right chevron' style={{marginLeft: '1rem', marginRight: '-0.5rem'}} ></i>
      </Link>
      <hr className='ui hidden divider' />
    </section>
  )
}

Report.proptypes = {
}

export default Report
