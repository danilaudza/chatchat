import React, {Component} from 'react';
import { View } from 'react-native';
import TextInputComponent from '../Components/TextInputComponent'
import ButtonComponent from '../Components/ButtonComponent'
import {SignUp} from '../Firebase/SignUp';
import {AddUser} from '../Firebase/Users';
import Firebase from '../Firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Spinner from 'react-native-loading-spinner-overlay'

class SignUpSCR extends Component{
    state = {
        name:"",
        email:"",
        password:"",
        loader:false
    }

    SignUptoFirebase = async ()=>{
        if(!this.state.name)
        {
            return alert('Please Enter Name');
        }
        if(!this.state.email)
        {
            return alert('Please Enter Email');
        }
        if(!this.state.password)
        {
            return alert('Please Enter Password');
        }
        this.setState({loader:true})
        SignUp(this.state.email, this.state.password)
        .then(async (res) => {
            // console.log('res', res);
            var userUID = Firebase.auth().currentUser.uid;
            AddUser(this.state.name,this.state.email,'',userUID)
            .then(async ()=>{
                this.setState({loader:false})
                await AsyncStorage.setItem('UID', uid);
                this.props.navigation.navigate('Dashboard')
            })
            .catch((error)=>{
                this.setState({loader:false})
                alert(error);
            })
            // console.log(userUID);
        }).catch((err) => {
            alert(err);
        })
    }
    render() {
        return(
            <View style={{flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'}}> 
            <TextInputComponent placeholder="Enter Name" updateFields={(text) => this.setState({ name: text })} />
                <TextInputComponent placeholder="Enter Email" updateFields={(text) => this.setState({ email: text })} />
                <TextInputComponent placeholder="Enter Password" updateFields={(text) => this.setState({ password: text })} />
                <ButtonComponent title="Sign Up" onPress={() => { this.SignUptoFirebase() }} />
                <Spinner
                    visible={this.state.loader}

                />
            </View>
        )
    }
}

export default SignUpSCR