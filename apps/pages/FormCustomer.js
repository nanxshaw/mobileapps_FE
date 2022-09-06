


import React, { Component } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import restApi from '../api/RestApi';

const size_width = Dimensions.get('window').width;


class FormCustomer extends Component {
    //dropdown
    dropdown_branch;
    dropdown_product;
    dropdown_tenor;

    constructor(props) {
        super(props);
        this.state = {
            firstname: null,
            lastname: null,
            phone_number: null,

            branch: [],
            product: [],
            tenor: [],

            id_branch: null,
            id_product: null,
            id_tenor: null,

            name_branch: null,
            name_product: null,
            name_tenor: null,


            isLoadingSave: false,
            status_success: null
        };
    }

    componentDidMount() {
        console.log('masuk');
        this.getBranch();
        this.getProduct();
        this.getTenor();
        this.getDetailCustomer();
    }

    getTenor() {
        let tenor = [];
        for (let i = 1; i <= 60; i++) {
            tenor.push(i);
        }
        this.setState({ tenor });
    }

    getDetailCustomer() {
        const { id } = this.props.route.params;
        restApi.ApiGet('/GetDataCustomer?id=' + id).then((res) => {
            if (res.status == 200) {
                let row = res.data.data;
                this.setState({
                    firstname: row.FIRST_NAME,
                    lastname: row.LAST_NAME,
                    phone_number: row.PHONE_NO.toString(),
                    id_branch: row.BRANCH_ID,
                    id_product: row.PRODUCT_ID,
                    id_tenor: row.TENOR_ID,
                    name_branch: row.BRANCH_NAME,
                    name_product: row.PRODUCT_NAME,
                    name_tenor: row.TENOR_ID,
                })
            }
        })
    }

    //get branch
    getBranch() {
        restApi.ApiGet('/GetMasterBranch').then((res) => {
            if (res.status == 200) {
                this.setState({ branch: res.data.data })
            }
        })
    }

    //get product
    getProduct() {
        restApi.ApiGet('/GetMasterProduct').then((res) => {
            if (res.status == 200) {
                this.setState({ product: res.data.data })
            }
        })
    }

    UpdateCustomer() {
        const { id } = this.props.route.params;
        const { firstname, lastname, phone_number, id_branch, id_product, id_tenor } = this.state;
        if (firstname != null && firstname != '') {
            if (lastname != null && lastname != '') {
                if (phone_number != null && phone_number != '') {
                    if (id_branch != null && id_branch != '') {
                        if (id_product != null && id_product != '') {
                            if (id_tenor != null && id_tenor != '') {
                                this.setState({ isLoadingSave: true })
                                let data = {
                                    id:id,
                                    firstname: firstname,
                                    lastName: lastname,
                                    phoneNumber: phone_number,
                                    branch: id_branch,
                                    product: id_product,
                                    tenor: id_tenor,
                                    avatar: "https://i.pravatar.cc/50?u=1" + phone_number
                                }
                                restApi.ApiPut('/UpdateDataCust', data).then((res) => {
                                    if (res.status == 200) {
                                        this.setState({ isLoadingSave: false, status_success: true });
                                        this.props.navigation.pop();
                                    } else {
                                        this.setState({ isLoadingSave: false, status_success: false });
                                    }
                                })
                            } else {
                                Alert.alert('Notice', 'Tenor is not selected!');
                            }
                        } else {
                            Alert.alert('Notice', 'Product is not selected!');
                        }
                    } else {
                        Alert.alert('Notice', 'Branch is not selected!');
                    }
                } else {
                    Alert.alert('Notice', 'Phone Number is required!');
                }
            } else {
                Alert.alert('Notice', 'Last Name is required!');
            }
        } else {
            Alert.alert('Notice', 'First Name is required!');
        }
    }

    render() {
        const {
            firstname,
            lastname,
            phone_number,
            branch,
            product,
            tenor,
            name_branch,
            name_product,
            name_tenor,
            isLoadingSave,
            status_success
        } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ flexGrow: 1 }} nestedScrollEnabled={true}>
                    <Text style={styles.title}>Update Data Customer</Text>
                    <View style={styles.form_box}>
                        <TextInput
                            placeholder='First Name'
                            maxLength={30}
                            style={styles.in}
                            onChangeText={(firstname) => this.setState({ firstname })}
                            value={firstname}
                        />
                        <TextInput
                            placeholder='Last Name'
                            maxLength={30}
                            style={styles.in}
                            onChangeText={(lastname) => this.setState({ lastname })}
                            value={lastname}
                        />
                        <TextInput
                            placeholder='Phone Number'
                            style={styles.in}
                            maxLength={13}
                            keyboardType='numeric'
                            onChangeText={(phone_number) => this.setState({ phone_number })}
                            value={phone_number}
                        />

                        <SelectDropdown
                            buttonStyle={styles.btn_dropdown}
                            data={branch}
                            ref={(ref) => this.dropdown_branch = ref}
                            defaultButtonText={name_branch}
                            onSelect={(selectedItem) => {
                                this.setState({ id_branch: selectedItem.BRANCH_ID })
                            }}
                            rowTextForSelection={(item) => {
                                return item.BRANCH_NAME;
                            }}
                            buttonTextAfterSelection={(selectedItem) => {
                                return selectedItem.BRANCH_NAME
                            }}
                        />
                        <SelectDropdown
                            buttonStyle={styles.btn_dropdown}
                            data={product}
                            ref={(ref) => this.dropdown_product = ref}
                            defaultButtonText={name_product}
                            onSelect={(selectedItem) => {
                                this.setState({ id_product: selectedItem.PRODUCT_ID })
                            }}
                            rowTextForSelection={(item) => {
                                return item.PRODUCT_NAME;
                            }}
                            buttonTextAfterSelection={(selectedItem) => {
                                return selectedItem.PRODUCT_NAME
                            }}
                        />
                        <SelectDropdown
                            buttonStyle={styles.btn_dropdown}
                            data={tenor}
                            ref={(ref) => this.dropdown_tenor = ref}
                            defaultButtonText={name_tenor}
                            onSelect={(selectedItem) => {
                                this.setState({ id_tenor: selectedItem })
                            }}
                        />

                        <TouchableOpacity onPress={() => this.UpdateCustomer()} style={styles.submit} activeOpacity={.7}>
                            <Text style={styles.btn_tx_white}>{isLoadingSave == false ? 'Update' : 'Loading..'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.pop()} style={styles.clear_form} activeOpacity={.7}>
                            <Text style={styles.btn_tx_white}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        status_success == true ?
                            <View style={styles.alert_done}>
                                <Text style={styles.tx_alert_done}>Update Success!</Text>
                            </View>
                            :
                            status_success == false ?
                                <View style={styles.alert_fail}>
                                    <Text style={styles.tx_alert_fail}>Update Error!</Text>
                                </View>
                                :
                                null
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 10
    },
    form_box: {
        justifyContent: "center",
        alignSelf: "center",
        width: size_width * 60 / 100
    },
    in: {
        borderBottomColor: '#333',
        padding: 8,
        borderBottomWidth: 1,
        marginBottom: 10
    },
    btn_dropdown: {
        width: size_width * 60 / 100,
        height: 40,
        marginBottom: 10,
        borderColor: "#333",
        borderWidth: 1
    },
    submit: {
        backgroundColor: "#3CB371",
        borderRadius: 7,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 100
    },
    clear_form: {
        backgroundColor: "#6B8E23",
        borderRadius: 7,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10

    },
    btn_tx_white: {
        color: "#FFF"
    },
    alert_done: {
        backgroundColor: "#90EE90",
        padding: 7,
        borderRadius: 5,
        margin: 10,
    },
    tx_alert_done: {
        color: "#008000",
        fontWeight: "bold",
    },
    alert_fail: {
        backgroundColor: "#FFB6C1",
        padding: 7,
        borderRadius: 5,
        margin: 10,
    },
    tx_alert_fail: {
        color: "#FF4500",
        fontWeight: "bold",
    }
});

export default FormCustomer;
