import React, { Component } from "react";
import {
  Image,
  FlatList,
  Button,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Card } from "react-native-elements";
import { styles } from "../../../styles";
import Icon from "react-native-vector-icons/FontAwesome5";
import Swiper from "react-native-swiper";
import * as util from "../../../utilities";
import Swipeout from "react-native-swipeout";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import * as TASKS from "../../../store/actions";
import Toast from "react-native-root-toast";

class SelectList extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require("../../../../assets/Logo.png")}
      />
    ),
    headerLeft: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      addListModal: false,
      list_id: null,
      newListName: "",
      productData: this.props.navigation.state.params.productData,
      bundleData: this.props.navigation.state.params.bundleData,
    };
    this.props.fetchLists();
  }
  componentDidMount(){
    console.log('bundle Data in Select',this.state.bundleData)
  }
  modalAddListToggler() {
    this.setState({ addListModal: !this.state.addListModal });
  }
  onCreateNewObject = () => {
    if (this.state.newListName) {
      var addParams = {
        name: this.state.newListName,
        user_id: 2,
      };
      this.props.addNewObjectListBackend(addParams);
    }
    this.modalAddListToggler();
  };
  modalAddList() {
    return (
      <Modal isVisible={this.state.addListModal}>
        <View style={{ bottom: util.WP("30") }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.modalAddListToggler();
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require("../../../../assets/close-round.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.smallModalContainer}>
            <Text style={styles.modalTitle}>New List</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder={"List Name"}
              placeholderTextColor="#828282"
              value={this.state.newListName}
              onChangeText={(text) => {
                this.setState({ newListName: text });
              }}
            />
            <TouchableOpacity
              style={styles.modalBlueButton}
              onPress={this.onCreateNewObject}
            >
              <Text
                style={{
                  fontSize: util.WP("4"),
                  fontFamily: "Montserrat-SemiBold",
                  color: "#fff",
                }}
              >
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  addItem() {
    if (this.state.list_id) {
      if (this.state.productData?.product_id) {
        var addParams = {
          list_id: this.state.list_id,
          product_id: this.state.productData.product_id,
          product_quantity: '1'
        };
        this.props.addListItem(addParams);
        this.props.navigation.goBack();
      }
      if (this.state.bundleData?.coupon_id) {
        var addParams = {
          list_id: this.state.list_id,
          bundleData: this.state.bundleData,
        };
        this.props.addListBundle(addParams);
        this.props.navigation.goBack();
      }
    } else {
      util.showToast("Please select a List to Add !");
    }
  }
  selectList(list_id) {
    this.setState({
      list_id: list_id,
    });
  }
  render() {
    return (
      <ScrollView style={styles.containerDarker}>
        <View style={styles.blueContainerSmall}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: util.WP(4),
              marginRight: util.WP(14),
              marginTop: util.HP(3),
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  style={{ height: util.WP(7), width: util.WP(7) }}
                  source={require("../../../../assets/arrow-left-white.png")}
                />
              </TouchableOpacity>
              <Text style={styles.h1ListTitle}>Select List</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.modalAddListToggler();
              }}
            >
              <Image
                style={{ height: util.WP(7), width: util.WP(7) }}
                source={require("../../../../assets/add-sign.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        {this.modalAddList()}
        {this.props.fetchedLists != null ? (
          <View>
            <FlatList
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 20,
                marginTop: 20,
              }}
              data={this.props.fetchedLists}
              renderItem={({ item: rowData }) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      borderColor: "#F2F2F2",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.selectList(rowData.id)}
                    >
                      {this.state.list_id == rowData.id ? (
                        <Image
                          style={{ height: util.WP(7), width: util.WP(7) }}
                          source={require("../../../../assets/oval-checked.png")}
                        />
                      ) : (
                        <Image
                          style={{ height: util.WP(7), width: util.WP(7) }}
                          source={require("../../../../assets/oval.png")}
                        />
                      )}
                    </TouchableOpacity>
                    <View style={styles.selectListView}>
                      <TouchableOpacity
                        onPress={() => this.selectList(rowData.id)}
                      >
                        <Text style={styles.listName}>{rowData.name}</Text>
                      </TouchableOpacity>
                      {/* <Text style={{fontSize:12,fontFamily:'Montserrat-Regular',marginTop:2,color:'#2E2E2E'}}> */}
                      {/* { ((rowData.stuff).length > util.WP('10')) ? 
                                (((rowData.stuff).substring(0,util.WP('12')-3)) + '...') : 
                                rowData.stuff } */}
                      {/* CocaCola, Candies , Alot More, Stuff */}
                      {/* </Text> */}
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              onPress={() => this.addItem()}
              style={[
                styles.addToListBlue,
                { width: util.WP(94), marginLeft: util.WP(3) },
              ]}
            >
              <Text
                style={{
                  fontSize: util.WP("5"),
                  fontFamily: "Montserrat-SemiBold",
                  color: "#fff",
                }}
              >
                Add To List
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loader}>{util.Lumper({ lumper: false })}</View>
        )}
      </ScrollView>
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    fetchedLists: state.Lists.fetchedLists,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    fetchLists: () => dispatch(TASKS.fetchLists()),
    addListItem: (addItemParams) => dispatch(TASKS.addListItem(addItemParams)),
    addListBundle: (addItemParams) =>
      dispatch(TASKS.addListBundle(addItemParams)),
    addNewObjectListBackend: (addParams) =>
      dispatch(TASKS.addNewObjectListBackend(addParams)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectList);
