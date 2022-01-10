import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Header from '../Shared/Header/Header'
import DatePicker from 'react-datepicker'
import NetWorthChart from './ChartComponents/NetWorthChart/NetWorthChart'
import DistributionChart from './ChartComponents/DistributionChart/DistributionChart'
import LoadingScreen from '../Shared/LoadingScreen/LoadingScreen'
import getChartData from '../../actions/getChartData'
import dayjs from 'dayjs'
import './Charts.css'

export default function Charts() {

    const oldestTransactionDate = useSelector(state => state.user.data.oldestTransactionDate)
    const dataset = useSelector(state => state.chartData.data)
    const dispatch = useDispatch()
    const [chart, setChart] = useState('net-worth')
    const [startDate, setStartDate] = useState(new Date(oldestTransactionDate))
    const [endDate, setEndDate] = useState()
    const [svgHeight, setSvgHeight] = useState(450)

    function drawChart(chart, dataset) {
        switch(chart) {
            case 'net-worth':
                return <NetWorthChart dataset={dataset} onSetSvgHeight={onSetSvgHeight}/>
            case 'income-distribution':
                return <DistributionChart dataset={dataset} onSetSvgHeight={onSetSvgHeight} type='income'/>
            case 'expense-distribution':
                return <DistributionChart dataset={dataset} onSetSvgHeight={onSetSvgHeight} type='expense'/>
            default:
                return
        }
    }

    function onSetSvgHeight(width, legendHeight) {
        if (width > 600) {
            setSvgHeight(375 + legendHeight)
        }
        else {
            setSvgHeight(225 + legendHeight)
        }
    }

    useEffect(() => {
        const startDateString = startDate ? dayjs(startDate).format('YYYY/M/D') : dayjs(oldestTransactionDate).format('YYYY/M/D')
        const endDateString = endDate ? dayjs(endDate).format('YYYY/M/D') : dayjs(100000000000000).format('YYYY/M/D')
        dispatch(getChartData(startDateString, endDateString, chart))
    }, [dispatch, chart, startDate, endDate, oldestTransactionDate])

    const fetching = useSelector(state => state.chartData.fetching)

    return (
        <>
        <Header links={[{path: '/charts', text: 'Charts'}, {path: '/dashboard', text: 'Dashboard'}, {path: '/profile', text: 'Profile'}, {logout: true}]}></Header>
        <main className='chart-container'>
            <form className='chart-form'> 
                <div className='search-form-item'>
                    <label htmlFor='from' style={{margin: 0}}>From</label>
                    <DatePicker className='form-control text-input' dateFormat="dd/MM/yyyy" minDate={new Date(oldestTransactionDate)}
                     selected={startDate} maxDate={endDate} onChange={date => setStartDate(date)}/>
                </div>
                <div className='search-form-item'>
                    <label htmlFor='to' style={{margin: 0}}>To</label>
                    <DatePicker className='form-control text-input' dateFormat="dd/MM/yyyy"
                     selected={endDate} minDate={startDate} onChange={date => setEndDate(date)}/>
                </div>
                <div className='search-form-item wide-grid-item'>
                    <label htmlFor='type' style={{margin: 0}}>Chart</label>
                    <select className='form-control text-input' value={chart} onChange={e => setChart(e.target.value)}>
                        <option value='net-worth'>Net worth</option>                    
                        <option value='income-distribution'>Income distribution</option>
                        <option value='expense-distribution'>Expense distribution</option>
                    </select>
                </div>
            </form>
            {fetching
              ? <LoadingScreen style={{color: 'black', width: 60, height: 60}} classes='chart flex-center'/>
              : <div className='chart' style={{height: svgHeight}}>
                  {drawChart(chart, dataset)}
                </div>
            }
        </main>
        </>
    )
}
