import React, { Component } from 'react';
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
  Platform
} from 'react-native';
import { Card } from 'react-native-elements';
import { styles } from '../../../styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import * as util from '../../../utilities';
import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import analytics from '@react-native-firebase/analytics';

const data = [
  {
    listTitle: 'Party Stuff',
    stuff: 'CocaCola, Candies',
  },
  {
    listTitle: 'Party Stuff Having Medium Length',
    stuff: 'CocaCola, Candies , Alot More, Stuff',
  },
  {
    listTitle: 'Party Stuff Having Relatively Larger Length than previous',
    stuff:
      'CocaCola, Candies, Phone Not Allowed, Dumt Text, Some More Data and all of data koo cslkcjasdj  kasdhflasdbf',
  },
];

class Lists extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    //header: null,
    //headerMode: 'none',
    //gestures: null,
    //gesturesEnabled: false,
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require('../../../../assets/Logo.png')}
      />
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      data: data,
      addListModal: false,
      editListModal: false,
      isMounted: false,
      newListName: '',
      editListName: '',
      activeRow: null,
      swipeOutBtns: [
        {
          text: 'EDIT',
          color: '#fff',
          backgroundColor: '#26ACE1',
          onPress: () => {
            this.modalEditListToggler();
          },
        },
        {
          text: 'DELETE',
          color: '#fff',
          backgroundColor: '#FF3B30',
          type: 'delete',
          onPress: () => {
            //console.log(this.props.fetchedLists)
            this.props.fetchedLists.map((currElement, thisIndex) => {
              if (this.state.activeRow == currElement.id) {
                this.props.fetchedLists.splice(thisIndex, 1);
                var deleteParams = {
                  list_id: this.state.activeRow,
                  user_id: 2,
                };
                this.props.deleteNewObjectListBackend(deleteParams);
                if (this.state.activeRow === this.props.activeList) {
                  this.props.setActiveList(null)
                }
                this.setState({ activeRow: null });
              }
            });
            //console.log(this.props.fetchedLists)
          },
        },
      ],
    };

    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().logScreenView({screen_name:'ListsScreen'});
  }
  componentDidMount() {
    if (!this.props.isGuestUser) {
      // this.props.fetchLists();
      this.willFocusListner = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.props.fetchLists();
          this.props.getOrderStatus();
        }
      );
    }

    this.setState({ isMounted: true });
  }
  componentWillUnmount() {
    if (!this.props.isGuestUser) {
      this.willFocusListner.remove();
    }
  }
  modalAddListToggler() {
    this.setState({ addListModal: !this.state.addListModal });
  }
  modalEditListToggler() {
    this.setState({ editListModal: !this.state.editListModal });
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
  onEditList = () => {
    if (this.state.editListName) {
      var editParams = {
        name: this.state.editListName,
        list_id: this.state.activeRow,
        user_id: 2,
      };
      this.props.editNewObjectListBackend(editParams);
      this.props.fetchedLists.map((currElement, thisIndex) => {
        if (this.state.activeRow == currElement.id) {
          this.props.fetchedLists[thisIndex].name = this.state.editListName;
          this.setState({ editListName: '' });
        }
      });
    }

    this.modalEditListToggler();
  };
  onSwipeOpen(id, name) {
    this.setState({ activeRow: id });
    this.setState({ editListName: name });
  }
  onSwipeClose() {
    //this.setState({activeRow:null});
    //this.setState({editListName:""});
  }
  goToListDetails(list_id, name) {
    if (list_id) {
      this.props.navigation.navigate('ListDetail', {
        list_id: list_id,
        list_name: name,
      });
    }
  }
  modalAddList() {
    return (
      <Modal isVisible={this.state.addListModal}>
        <View style={{ bottom: util.WP('30') }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.modalAddListToggler();
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require('../../../../assets/close-round.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.smallModalContainer}>
            <Text style={styles.modalTitle}>New List</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder={'List Name'}
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
                  fontSize: util.WP('4'),
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#fff',
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
  modalEditList() {
    return (
      <Modal isVisible={this.state.editListModal}>
        <View style={{ bottom: util.WP('30') }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.modalEditListToggler();
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require('../../../../assets/close-round.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.smallModalContainer}>
            <Text style={styles.modalTitle}>Edit List</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder={'List Name'}
              placeholderTextColor="#828282"
              value={this.state.editListName}
              onChangeText={(text) => {
                this.setState({ editListName: text });
              }}
            />
            <TouchableOpacity
              style={styles.modalBlueButton}
              onPress={this.onEditList}
            >
              <Text
                style={{
                  fontSize: util.WP('4'),
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#fff',
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  render() {
    console.log(this.props.fetchedLists);
    return this.state.isMounted ? (
      <View style={styles.containerDarker}>
        <View style={styles.blueContainerSmall}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 15,
              marginRight: 15,
              marginTop: util.HP(3),
            }}
          >
            <Text style={styles.h1ListTitle}>My Lists</Text>
            {this.props.isGuestUser ? (
              <Image
                style={{ height: util.WP(7), width: util.WP(7) }}
                source={require('../../../../assets/add-sign.png')}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.modalAddListToggler();
                }}
              >
                <Image
                  style={{ height: util.WP(7), width: util.WP(7) }}
                  source={require('../../../../assets/add-sign.png')}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {this.modalAddList()}
        {this.modalEditList()}
        

        {!this.props.isGuestUser ? (
          this.props.fetchedLists != null && this.props.fetchedLists.length ? (
            <View style={{flex:1}}>
            {this.props.fetchedLists.length < 3 && 
              <View style={{marginRight:16}}>
                <Icon
                  name={'caret-up'}
                  size={util.WP(8)}
                  color="#00355F"
                  style={{
                    textAlign: 'right',
                    lineHeight: util.WP(5.5),
                    textAlignVertical: 'bottom',
                    marginTop: util.WP(1),
                  }}
                />
                <Text
                  style={{
                    textAlign: 'right',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Bold',
                    color: '#00355F',
                    textTransform: 'uppercase',
                    lineHeight: util.WP(3.4),
                  }}
                >
                  Add new List
                </Text>
              </View>
            }
            <View>
            <FlatList
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 10,
                marginTop: 20,
              }}
              data={this.props.fetchedLists}
              extraData={this.props.fetchedLists}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: rowData, index }) => {
                return (
                  <View index={index}>
                    <Swipeout
                      style={{ backgroundColor: '#fff' }}
                      right={this.state.swipeOutBtns}
                      onOpen={(secId, rowId, direction) =>
                        this.onSwipeOpen(rowData.id, rowData.name)
                      }
                      onClose={(secId, rowId, direction) => this.onSwipeClose()}
                      buttonWidth={util.WP('25')}
                      autoClose={true}
                      rowId={this.props.index}
                      sectionId={1}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.goToListDetails(rowData.id, rowData.name)
                        }
                      >
                        <View style={styles.listView}>
                          <Text style={styles.listName}>{rowData.name}</Text>
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: 'Montserrat-Regular',
                              marginTop: 2,
                              color: '#2E2E2E',
                            }}
                          >
                            {/* { ((rowData.stuff).length > util.WP('10')) ? 
                          (((rowData.stuff).substring(0,util.WP('12')-3)) + '...') : 
                          rowData.stuff } */}
                            {rowData.products
                              ? rowData.products.length >= 1
                                ? rowData.products[0].desc.substring(0, 20) +
                                  '...'
                                : null
                              : null}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Swipeout>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
            </View>
            {this.props.fetchedLists.length < 3 ?
              <View style={{ marginHorizontal: 25}}>
              {/* {util.Lumper({ lumper: false })} */}
              <Text
                style={{
                  color: '#8b8b8b',
                  fontFamily: 'Montserrat-Regular',
                  fontSize: Platform.OS === 'ios' ?  util.WP(5.79): util.WP(5),
                  lineHeight: util.WP(8),
                  marginTop: util.WP(5),
                }}
              >
                Click{' '}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    textTransform: 'uppercase',
                    fontSize: util.WP(8),
                  }}
                >
                  +
                </Text>{' '}
                to create your list, once you have filled out your list
                press the{' '}
                <Text
                  style={{
                    color: '#e5873c',
                    fontFamily: 'Montserrat-SemiBold',
                    textTransform: 'uppercase',
                  }}
                >
                  order now
                </Text>{' '}
                button to move to the next step where you will then enter
                quantities to order groceries from your selected store.
              </Text>
            </View>
            : null}
            </View>
          ) : (
            <View style={{ marginHorizontal: 25 }}>
            <View>
                <Icon
                  name={'caret-up'}
                  size={util.WP(8)}
                  color="#00355F"
                  style={{
                    textAlign: 'right',
                    lineHeight: util.WP(5.5),
                    textAlignVertical: 'bottom',
                    marginTop: util.WP(1),
                  }}
                />
                <Text
                  style={{
                    textAlign: 'right',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Bold',
                    color: '#00355F',
                    textTransform: 'uppercase',
                    lineHeight: util.WP(3.4),
                  }}
                >
                  Add new List
                </Text>
              </View>
              {/* {util.Lumper({ lumper: false })} */}
              <Text
                style={{
                  color: '#8b8b8b',
                  fontFamily: 'Montserrat-Regular',
                  fontSize: Platform.OS === 'ios' ?  util.WP(5.79): util.WP(5),
                  lineHeight: util.WP(8),
                  marginTop: util.WP(20),
                }}
              >
                Click{' '}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    textTransform: 'uppercase',
                    fontSize: util.WP(8),
                  }}
                >
                  +
                </Text>{' '}
                to create your first list, once you have filled out your list
                press the{' '}
                <Text
                  style={{
                    color: '#e5873c',
                    fontFamily: 'Montserrat-SemiBold',
                    textTransform: 'uppercase',
                  }}
                >
                  order now
                </Text>{' '}
                button to move to the next step where you will then enter
                quantities to order groceries from your selected store.
              </Text>
            </View>
          )
        ) : (
          <View style={styles.containerWhite}>
            <View style={styles.loader}>
              <Text style={styles.noDataText}>
                Plan your shopping, build and share your shopping lists to save
                time and money!
              </Text>
              <TouchableOpacity
                style={{
                  ...styles.containerButton,
                  width: '40%',
                  padding: 10,
                  marginTop: 20,
                }}
                onPress={() => this.props.navigation.navigate('Login')}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#fff',
                  }}
                >
                  Register Now!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    ) : (
      <View />
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    fetchedLists: state.Lists.fetchedLists,
    isGuestUser: state.login.isGuestUser,
    activeList: state.Lists.activeList,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    fetchLists: () => dispatch(TASKS.fetchLists()),
    getOrderStatus: () => dispatch(TASKS.getOrderStatus()),
    setActiveList: (id) => dispatch(TASKS.setActiveList(id)),
    fetchListItems: (listItemParams) =>
      dispatch(TASKS.fetchListItems(listItemParams)),
    addNewObjectListBackend: (addParams) =>
      dispatch(TASKS.addNewObjectListBackend(addParams)),
    deleteNewObjectListBackend: (deleteParams) =>
      dispatch(TASKS.deleteNewObjectListBackend(deleteParams)),
    editNewObjectListBackend: (editParams) =>
      dispatch(TASKS.editNewObjectListBackend(editParams)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lists);
