import React from 'react'
import { FlatList, Text, View } from 'react-native'
import alpacaAPI from '../services/alpaca'
import { dashboardStyle } from '../styles/dashboardStyle'
import { Ionicons } from '@expo/vector-icons'

class DashboardScreen extends React.Component {
    
    static navigationOptions = {
        title: 'Dashboard',
        headerStyle: {
            backgroundColor: '#1e222d',
        },
        headerTitleStyle: {
            color: 'white'
        }
    };
    constructor(props) {
        super(props)
        
        this.state = {
            buying_power: 0,
            cash: 0,
            long_market_value: 0,
            portfolio_value: 0,
            positions: [],
        }
    }
    
    componentDidMount() {
        // Alpaca API
        const alpaca = alpacaAPI()

        alpaca.getAccount().then((response) => {
            if (response.ok) {
                this.setState({
                    buying_power: response.data.buying_power,
                    long_market_value: response.data.long_market_value,
                    portfolio_value: response.data.portfolio_value,
                    cash: response.data.cash
                })
            }
        })

        alpaca.getPositions().then((response) => {
            if (response.ok) {
                this.setState({
                    positions: response.data
                })
            }
        }) 
        
        const symbols = ['DIA', 'SPY', 'QQQ', 'IWM']
        
        symbols.map((symbol) =>{
            alpaca.getMarket(symbol).then((response) => {
                let state = this.state
                state[symbol] = response.data[symbol][0].c
                this.setState(state)
            })
        })
        symbols.map((symbol) =>{
            alpaca.getMarket(symbol).then((response) => {
                let state = this.state
                let temp = symbol + "1"
                state[temp] = response.data[symbol][0].o
                this.setState(state)
            })
        })
    }

    renderRow = ({item}) => {
        return (
            <View key = {item.asset_id} style = {dashboardStyle.positions}>
                <View style = {dashboardStyle.positionsLeftCell}>
                    <Text style = {dashboardStyle.tickerSymbol}> {item.symbol} </Text>
                    <Text style = {dashboardStyle.subheading}> {item.qty} @ {item.avg_entry_price} </Text>
                </View>
                <View style = {dashboardStyle.positionsRightCell}>
                    <Text style = {dashboardStyle.price}>${item.current_price} </Text> 
                    {item.avg_entry_price > item.current_price ? <Text style = {dashboardStyle.changeD}>
                        {(item.change_today * 100).toFixed(2)}% 
                        <Ionicons name="md-arrow-dropdown" size={22} color="#e53935"></Ionicons> 
                    </Text>  : null }
                    {item.avg_entry_price < item.current_price ? <Text style = {dashboardStyle.changeU}>
                        {(item.change_today * 100).toFixed(2)}% 
                        <Ionicons name="md-arrow-dropup" size={22} color="#017b6f"></Ionicons> 
                    </Text>  : null }
                </View>
            </View> 
        )
    }
    
    render() {
        return <View style = {dashboardStyle.screen}>
            {/*Account info view*/}
            <View style = {dashboardStyle.account}>
                <Text style = {dashboardStyle.heading}>Account</Text>
                <View
                    style={{
                        borderBottomColor: '#131722',
                        borderBottomWidth: 2,
                        marginBottom: -3,
                        marginLeft: -20,
                        marginTop: 5
                    }}
                />
                <View style = {dashboardStyle.accountCell}>
                    <View style = {dashboardStyle.subCell}>
                        <Text style = {dashboardStyle.label}>Buying Power:</Text>
                        <Text style = {dashboardStyle.accountInfo}>${this.state.buying_power}</Text>
                        <Text style = {dashboardStyle.label}>Long Market Value:</Text>
                        <Text style = {dashboardStyle.accountInfo}>${this.state.long_market_value}</Text>
                    </View>
                    
                    <View style = {dashboardStyle.subCell}>
                        <Text style = {dashboardStyle.label}>Portfolio Value:</Text>
                        <Text style = {dashboardStyle.accountInfo}>${this.state.portfolio_value}</Text>
                        <Text style = {dashboardStyle.label}>Cash:</Text>
                        <Text style = {dashboardStyle.accountInfo}>${this.state.cash}</Text>
                    </View>
                </View>
            </View>

            {/*Market info view*/}
            <View style = {dashboardStyle.market}>
                <Text style = {dashboardStyle.pHeading}>Market</Text>
                <View
                    style={{
                        borderBottomColor: '#131722',
                        borderBottomWidth: 2,
                        marginBottom: 3,
                        marginTop: 3
                    }}
                />
                <View style = {{flex: 1, flexDirection: 'row'}}>
                    <View style = {dashboardStyle.scoreBoard}>
                        <Text style = {dashboardStyle.indexSymbol}>DIA</Text>
                        <Ionicons name="md-arrow-dropup" size={22} color="white"></Ionicons> 
                        <Text style = {dashboardStyle.indexPrice}>{this.state.DIA}</Text>
                    </View>

                    <View style = {dashboardStyle.scoreBoard}>
                        <Text style = {dashboardStyle.indexSymbol}>SPY</Text>
                        <Ionicons name="md-arrow-dropup" size={22} color="white"></Ionicons> 
                        <Text style = {dashboardStyle.indexPrice}>{this.state.SPY}</Text>
                    </View>

                    <View style = {dashboardStyle.scoreBoard}>
                        <Text style = {dashboardStyle.indexSymbol}>QQQ</Text>
                        <Ionicons name="md-arrow-dropup" size={22} color="white"></Ionicons> 
                        <Text style = {dashboardStyle.indexPrice}>{this.state.QQQ}</Text>
                    </View>

                    <View style = {dashboardStyle.scoreBoard}>
                        <Text style = {dashboardStyle.indexSymbol}>IWM</Text>
                        <Ionicons name="md-arrow-dropup" size={22} color="white"></Ionicons> 
                        <Text style = {dashboardStyle.indexPrice}>{this.state.IWM}</Text>
                    </View>
                </View>
            </View>

            {/*Portfolio info view*/}
            <View style = {dashboardStyle.position}>
                <Text style = {dashboardStyle.pHeading}>Positions</Text>
                <View
                    style={{
                        borderBottomColor: '#131722',
                        borderBottomWidth: 2,
                        marginBottom: 3,
                        marginTop: 3
                    }}
                />
                <FlatList 
                    data = {this.state.positions}
                    renderItem = {this.renderRow}
                    keyExtractor = {item => item.asset_id}
                />
            </View>
        </View>
    }
}

export default DashboardScreen