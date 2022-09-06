import React, { Component } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert, Dimensions, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import restApi from '../api/RestApi';

const size_width = Dimensions.get('window').width;
class Customer extends Component {
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

            modalDelete: false,
            dataModalDelete: null,

            list_customer: [],

            isLoadingSave: false,
            status_success: null,
            status_del_success: null
        };
    }

    componentDidMount() {
        this.getCustomer();
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.getCustomer();
        });
        this.getBranch();
        this.getProduct();
        this.getTenor();
    }

    getTenor() {
        let tenor = [];
        for (let i = 1; i <= 60; i++) {
            tenor.push(i);
        }
        this.setState({ tenor });
    }

    getCustomer() {
        restApi.ApiGet('/GetAllDataCust').then((res) => {
            if (res.status == 200) {
                this.setState({ list_customer: res.data.data })
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

    SubmitCustomer() {
        const { firstname, lastname, phone_number, id_branch, id_product, id_tenor } = this.state;
        if (firstname != null && firstname != '') {
            if (lastname != null && lastname != '') {
                if (phone_number != null && phone_number != '') {
                    if (id_branch != null && id_branch != '') {
                        if (id_product != null && id_product != '') {
                            if (id_tenor != null && id_tenor != '') {
                                this.setState({ isLoadingSave: true })
                                let data = {
                                    firstname: firstname,
                                    lastName: lastname,
                                    phoneNumber: phone_number,
                                    branch: id_branch,
                                    product: id_product,
                                    tenor: id_tenor,
                                    avatar: "https://i.pravatar.cc/50?u=1" + phone_number
                                }
                                restApi.ApiPost('/SaveDataCust', data).then((res) => {
                                    if (res.status == 200) {
                                        this.setState({ isLoadingSave: false, status_success: true, status_del_success:null });
                                        this.getCustomer();
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

    ClearFrom() {
        this.dropdown_branch.reset();
        this.dropdown_product.reset();
        this.dropdown_tenor.reset();
        this.setState({
            firstname: null,
            lastname: null,
            phone_number: null,
            id_branch: null,
            id_product: null
        })

    }

    DelCustomer() {
        const { id, index } = this.state.dataModalDelete;
        let data = {
            id: id
        }
        restApi.ApiDelete('/DeleteDataCust', data).then((res) => {
            if (res.status == 200) {
                let row = this.state.list_customer;
                row.splice(index,1)
                this.setState({ 
                    status_del_success: true ,
                    list_customer:row,
                    modalDelete:false,
                    status_success: null, 
                });
            } else {
                this.setState({ 
                    status_del_success: false,
                    modalDelete:false 
                });
            }
        })
    }

    render() {
        const {
            firstname,
            lastname,
            phone_number,
            branch,
            product,
            tenor,
            list_customer,
            isLoadingSave,
            status_success,
            status_del_success,
            modalDelete
        } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ flexGrow: 1 }} nestedScrollEnabled={true}>
                    <Text style={styles.title}>Form Data Customer</Text>
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
                            defaultButtonText="Select Branch"
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
                            defaultButtonText="Select Product"
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
                            defaultButtonText="Select Tenor"
                            onSelect={(selectedItem) => {
                                this.setState({ id_tenor: selectedItem })
                            }}
                        />

                        <TouchableOpacity onPress={() => this.SubmitCustomer()} style={styles.submit} activeOpacity={.7}>
                            <Text style={styles.btn_tx_white}>{isLoadingSave == false ? 'Submit' : 'Loading..'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.ClearFrom()} style={styles.clear_form} activeOpacity={.7}>
                            <Text style={styles.btn_tx_white}>Clear Form</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        status_success == true ?
                            <View style={styles.alert_done}>
                                <Text style={styles.tx_alert_done}>Submit Success!</Text>
                            </View>
                            :
                            status_success == false ?
                                <View style={styles.alert_fail}>
                                    <Text style={styles.tx_alert_fail}>Submit Error!</Text>
                                </View>
                                :
                                null
                    }
                    {
                        status_del_success == true ?
                            <View style={styles.alert_done}>
                                <Text style={styles.tx_alert_done}>Delete Success!</Text>
                            </View>
                            :
                            status_del_success == false ?
                                <View style={styles.alert_fail}>
                                    <Text style={styles.tx_alert_fail}>Delete Error!</Text>
                                </View>
                                :
                                null
                    }
                    <View style={styles.list_box}>
                        {
                            list_customer.map((key, i) => (
                                <View key={i} style={styles.list}>
                                    <View style={{ width: 75 }}>
                                        <Image source={{ uri: key.AVATAR }} style={styles.img} />
                                    </View>
                                    <View style={{ width: (size_width * 90 / 100) - 75 }}>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => this.props.navigation.push('FormCustomer', { id: key.CUST_ID })}>
                                            <Text style={styles.title_list}>{key.FIRST_NAME + ' ' + key.LAST_NAME}</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.subtitle_list}>Branch Name : {key.BRANCH_NAME}</Text>
                                        <Text style={styles.subtitle_list}>Product Name : {key.PRODUCT_NAME}</Text>
                                        <Text style={styles.subtitle_list}>Tenor : {key.TENOR_ID}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.setState({ modalDelete: true, dataModalDelete: { id: key.CUST_ID, index: i } })} activeOpacity={.7} style={styles.btn_del}>
                                        <Icon name="close" size={15} color="#FFF" />
                                    </TouchableOpacity>
                                </View>))
                        }
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalDelete}
                    onRequestClose={() => {
                        this.setState({ modalDelete: false });
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modal_header}>
                                <Text style={{ fontSize: 18, color: "#3CB371", fontWeight: "bold" }}>Confirmation</Text>
                                <View style={{ position: "absolute", right: 10, alignSelf: "center" }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({ modalDelete: false });
                                    }}>
                                        <Icon name="close" size={20} color="#333" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.modal_content}>
                                <Text style={{ fontSize: 13, color: "#3CB371" }}>Confirm to Delete ?</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                                <TouchableOpacity onPress={() => this.setState({ modalDelete: false })} style={styles.btn_gray} activeOpacity={.7}>
                                    <Text style={styles.btn_tx_white}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.DelCustomer()} style={styles.btn_blue} activeOpacity={.7}>
                                    <Text style={styles.btn_tx_white}>Yes, Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

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
    list_box: {
        borderTopColor: "#666",
        borderTopWidth: 1,
        alignSelf: "center",
        width: '90%'
    },
    list: {
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 5,
    },
    img: {
        width: 70,
        height: 70
    },
    title_list: {
        fontWeight: "bold",
        fontSize: 14
    },
    subtitle_list: {
        fontSize: 13
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
    },
    btn_del: {
        backgroundColor: "#900",
        padding: 2,
        borderRadius: 5,
        height: 20,
        width: 20,
        alignItems: "center",
        position: "absolute",
        zIndex: 2,
        right: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        width: size_width * 80 / 100,
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modal_header: {
        padding: 10,
        borderBottomColor: '#CCC',
        borderBottomWidth: 1,
    },
    modal_content: {
        borderBottomColor: '#CCC',
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 10
    },
    btn_gray: {
        backgroundColor: "#666",
        borderRadius: 7,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 10
    },
    btn_blue: {
        backgroundColor: "#3CB371",
        borderRadius: 7,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 10
    },
});

export default Customer;
