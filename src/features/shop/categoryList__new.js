import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  findNodeHandle,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { styles } from "../../styles";
import { connect } from "react-redux";
import * as util from "../../utilities";
import * as TASKS from "../../store/actions";
import Swiper from "react-native-swiper";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import ProductStockInfoModal from "../shared/product/StockInfo";
import FastImage from "react-native-fast-image";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import analytics from "@react-native-firebase/analytics";
import { Card } from "react-native-elements";
import moment from "moment";

class categoryList extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require("../../../assets/clientLogo.png")}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      refresh: false,
      searchTerm: "",
      overlayId: null,
      searchOverlayId: null,
      bottomDrop: false,
      productID: null,
      addListModal: false,
      newListName: "",
      categories: [],
      category: this.props.navigation.getParam("cat"),
      department: this.props.navigation.getParam("department"),
      subDepartment: this.props.navigation.getParam("subDepartment"),
      productObj: null,
      activeList: null,
      searchItems: null,
      products: [],
      fetchedListItems: null,
      stockInfoModalIsVisible: false,
      offset: 0,
      limit: 5,
      loader: true,
      refresh: false,
      localSearching: false,
      searchedItems: [],
      catIndex: 0,
      promotionModal: false,
      loader: false,
    };
    this.screenanalytics();
  }

  async screenanalytics() {
    // await analytics().setCurrentScreen('ShopScreen', 'ShopScreen');
    await analytics().logScreenView({ screen_name: "categoryListScreen" });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  componentDidMount() {
    console.log("fetchedLists", this.props.fetchedLists);
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      if (
        this.props.navigation.state?.params?.ScreenrouteName ==
        "shopBundleScreen"
      ) {
        setTimeout(
          () => {
            this.setState({ promotionModal: true }, () => {
              this.props.navigation.setParams({ ScreenrouteName: "" });
            });
          },
          Platform.OS === "ios" ? 200 : 0
        );
      }
    });
    _categories = [];
    _searchItems = [];
    var departments = [...this.props.departments];
    departments.map((dept) => {
      if (this.state.department.id === dept.id) {
        dept.sub_departments.map((sub) => {
          if (sub.id === this.state.subDepartment.id) {
            sub.categories?.map((cat, index) => {
              let _cat = cat;
              if (_cat.id === this.state.category) {
                this.setState({ catIndex: index });
                _cat.products?.map((product) => {
                  if (product) {
                    let _product = product;
                    if (_product.is_scalable && !_product.size.includes("CT")) {
                      let _measureUnit = _product.size;
                      let _price = null;
                      if (
                        _measureUnit === "KG" ||
                        _measureUnit.includes("KG")
                      ) {
                        _price = parseFloat(
                          _product.unit_retail / 2.20462
                        ).toFixed(2);
                      }
                      if (_measureUnit === "G") {
                        _price = parseFloat(
                          _product.unit_retail / 453.59237
                        ).toFixed(2);
                      }
                      if (_measureUnit.includes("OZ")) {
                        _price = parseFloat(_product.unit_retail / 16).toFixed(
                          2
                        );
                      }
                      if (_measureUnit.includes("lb")) {
                        _price = _product.unit_retail;
                      }

                      _product.size = "lb";
                      _product.unit_retail = _price;
                      _product.quantity = 0.25;
                    } else {
                      _product.quantity = 1;
                    }
                    _searchItems.push(_product);
                  }
                });
              }

              _categories.push(_cat);
            });
          }
        });
      }
    });
    this.setState({ categories: _categories });
    this.setState({ searchItems: _searchItems });
    this.setState({ products: _searchItems });
    this.setState({
      activeList: this.props.activeList ? this.props.activeList : null,
    });

    setTimeout(() => {
      this.setState({ isMounted: true });
    }, 1000);
  }

  pagination = () => {
    const {
      limit,
      offset,
      searchItems,
      category,
      department,
      subDepartment,
    } = this.state;
    const products = [];
    const data = {
      cat_id: category,
      offset: offset + limit,
      limit: limit,
      dept: department,
      sub: subDepartment,
    };
    this.props.categoryProductsPaginated(data);
    this.setState({ refresh: !this.state.refresh });
  };
  renderFooter = () => {
    if (!this.state.loader) {
      return null;
    } else {
      return (
        <View>
          {util.Lumper({ lumper: false, size: 10, color: "#26ACE1" })}
        </View>
      );
    }
  };
  incrementPage = () => {
    this.setState({ loader: true });

    setTimeout(() => {
      this.setState({ refresh: !this.state.refresh, loader: false });
    }, 500);
    this.setState({ offset: this.state.offset + 1 });
    this.pagination();
  };

  delayMethod() {
    // setTimeout(() => {
    this.setState({ searchOverlayId: this.state.overlayId });
    // },200)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.isLoadingListItems &&
      this.props.isLoadingListItems !== prevProps.isLoadingListItems
    ) {
      if (this.props.fetchedListItems) {
        this.setState({ fetchedListItems: this.props.fetchedListItems }, () => {
          this.goToCheckout();
        });
      }
    }
    if (prevProps.ShopCatLoader !== this.props.ShopCatLoader) {
      _categories = [];
      _searchItems = [];

      this.props.departments.map((dept) => {
        if (this.state.department.id === dept.id) {
          dept.sub_departments.map((sub) => {
            if (sub.id === this.state.subDepartment.id) {
              sub.categories?.map((cat, index) => {
                let _cat = cat;
                if (_cat.id === this.state.category) {
                  this.setState({ catIndex: Math.round(index / 3) });
                  _cat.products?.map((product) => {
                    if (product) {
                      let _product = product;
                      if (
                        _product.is_scalable &&
                        !_product.size.includes("CT")
                      ) {
                        let _measureUnit = _product.size;
                        let _price = null;
                        if (
                          _measureUnit === "KG" ||
                          _measureUnit.includes("KG")
                        ) {
                          let _price = parseFloat(
                            _product.unit_retail / 2.20462
                          ).toFixed(2);
                        }
                        if (_measureUnit === "G") {
                          _price = parseFloat(
                            _product.unit_retail / 453.59237
                          ).toFixed(2);
                        }
                        if (_measureUnit.includes("OZ")) {
                          _price = parseFloat(
                            _product.unit_retail / 16
                          ).toFixed(2);
                        }
                        _product.size = "lb";
                        _product.unit_retail = _price;
                        _product.quantity = 0.25;
                      } else {
                        _product.quantity = 1;
                      }
                      _searchItems.push(_product);
                    }
                  });
                }

                _categories.push(_cat);
              });
            }
          });
        }
      });

      this.setState({ categories: _categories });
      this.setState({ products: _searchItems });
    }

    if (
      prevState.activeList !== this.state.activeList &&
      this.state.activeList
    ) {
      if (this.state.localSearching) {
        const _searchedItems = [...this.state.searchedItems];
        this.props.fetchedLists.map((list) => {
          if (list.id === this.state.activeList) {
            _searchedItems.map((item, index) => {
              let _item = item;
              list.products?.map((product) => {
                if (_item.id == product.id) {
                  if (_item.is_scalable) {
                    if (_item.quantity) {
                    }
                  }
                  _searchedItems[index].quantity =
                    product.pivot.product_quantity;
                }
              });
            });
          }
        });
        this.setState({ searchedItems: _searchedItems });
      } else {
        const _searchItems = [...this.state.searchItems];
        this.props.fetchedLists.map((list) => {
          if (list.id === this.state.activeList) {
            _searchItems.map((item, index) => {
              let _item = item;
              list.products?.map((product) => {
                if (item.id == product.id) {
                  _searchItems[index].quantity = product.pivot.product_quantity;
                }
              });
            });
          }
        });
        this.setState({ searchItems: _searchItems });
      }
    }
    // }
    if (
      this.props.activeList !== prevProps.activeList &&
      this.props.activeList
    ) {
      this.handleAddToList(this.props.activeList);
    }
  }
  renderSwiperImages() {
    if (this.props.promotions && this.props.promotions.length) {
      if (this.props.promotions) {
        return this.props.promotions.map((promotion, index) => {
          return (
            <View key={promotion.id.toString()} style={styles.swiperSlide}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  this.navigateToPromotionDetails(promotion.id);
                }}
              >
                <Image
                  style={styles.swiperImage}
                  source={{ uri: promotion.image }}
                />
              </TouchableOpacity>
            </View>
          );
        });
      } else {
        return (
          <View style={styles.swiperSlide}>
            <Image
              style={styles.swiperImage}
              source={{
                uri:
                  "https://cdn.dribbble.com/users/1449854/screenshots/4136663/no_data_found.png",
              }}
            />
          </View>
        );
      }
    }
  }

  navigateToPromotionDetails(promo_id) {
    var params = {
      promo_id: promo_id,
    };
    util.isOnline(
      () => {
        this.props.getPromotionDetails(params);
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }

  triggerSearch = (text, type) => {
    if (text.length > 2) {
      let searchTerm = text.trim().toLowerCase();
      this.setState({ searchTerm: text, overlayId: null });
      let _searchItems = [];
      this.props.departments.map((dept) => {
        if (dept.id === this.state.department.id) {
          dept.sub_departments.map((sub) => {
            if (sub.id === this.state.subDepartment.id) {
              sub.categories.map((cat) => {
                data = cat.products.filter((el) => {
                  return el.desc.toLowerCase().match(searchTerm);
                });
                if (data.length) {
                  data.map((item) => {
                    let _item = item;
                    if (_item.is_scalable && !_item.size.includes("CT")) {
                      let _measureUnit = _item.size;
                      let _price = null;
                      if (
                        _measureUnit === "KG" ||
                        _measureUnit.includes("KG")
                      ) {
                        _price = parseFloat(
                          _item.unit_retail / 2.20462
                        ).toFixed(2);
                      }
                      if (_measureUnit === "G") {
                        _price = parseFloat(
                          _item.unit_retail / 453.59237
                        ).toFixed(2);
                      }
                      if (_measureUnit.includes("OZ")) {
                        _price = parseFloat(_item.unit_retail / 16).toFixed(2);
                      }

                      if (_measureUnit.includes("lb")) {
                        _price = _item.unit_retail;
                      }

                      _item.size = "lb";
                      _item.unit_retail = _price;
                      _item.quantity = 0.25;
                    } else {
                      _item.quantity = 1;
                    }
                    _searchItems.push(_item);
                  });
                }
              });
            }
          });
        }
      });
      this.setState({ searchItems: _searchItems });
      this.setState({ page: 1 }, () => {
        this.pagination();
      });
      analytics().logEvent("searchTerms", {
        term: text,
        country_code: this.props.user.user_info.country,
      });
    } else {
      // console.log('category', this.state.category)
      this.handlecategoryClick(this.state.category);
      this.setState({
        searchTerm: null,
        overlayId: null,
        localSearching: false,
        searchedItems: [],
      });
    }
  };

  increseQuantity = (id, type) => {
    const prods = { ...this.state.products };
    var resultArray = Object.keys(prods).map(function(prodsIndex) {
      let _prod = prods[prodsIndex];
      if (_prod.id === id) {
        if (_prod.is_scalable) {
          _prod.quantity = _prod.quantity + 0.25;
        } else {
          _prod.quantity++;
        }
      }
      return _prod;
    });

    this.setState({ products: resultArray });
  };

  decreseQuantity = (id, type) => {
    const prods = { ...this.state.products };
    var resultArray = Object.keys(prods).map(function(prodsIndex) {
      let _prod = prods[prodsIndex];
      if (_prod.id === id) {
        if (_prod.quantity > 0) {
          if (_prod.is_scalable) {
            _prod.quantity =
              _prod.quantity > 0.25 ? _prod.quantity - 0.25 : _prod.quantity;
          } else {
            _prod.quantity > 1 ? _prod.quantity-- : _prod.quantity;
          }
        }
      }
      return _prod;
    });

    this.setState({ products: resultArray });
  };

  handleAddToList = (list_id) => {
    this.setState({ activeList: list_id });
    if (this.state.productObj) {
      let data = {
        list_id: list_id,
        product_id: this.state.productObj.id,
        product_quantity: this.state.productObj.quantity.toString(),
      };
      this.props.ShopaddListItem(data);
      this.setState({ productObj: null });
    }
    this.setState({
      bottomDrop: false,
      overlayId: null,
    });
  };

  addProductToList = (product) => {
    this.setState({ productObj: product });
    if (this.state.activeList) {
      let data = {
        list_id: this.state.activeList,
        product_id: product.id,
        product_quantity: product.quantity.toString(),
      };
      this.props.ShopaddListItem(data);

      this.setState({ productObj: null, overlayId: null });
    } else {
      this.setState({ bottomDrop: true });
    }
  };

  listItemsCount() {
    let count = 0;
    if (this.props.activeList && this.props.fetchedLists) {
      this.props.fetchedLists.map((list) => {
        if (list.id === this.props.activeList) {
          count = list.products.length;
        }
      });
      return count;
    }
  }

  onCreateNewObject = () => {
    if (this.state.newListName) {
      var addParams = {
        name: this.state.newListName,
        user_id: 2,
      };
      this.props.addNewObjectListBackend(addParams);
    }
    this.setState({ addListModal: false, bottomDrop: false });
  };

  modalAddList() {
    return (
      <Modal
        isVisible={this.state.addListModal}
        backdropColor="#fff"
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
        onBackdropPress={() => setVisibility(false)}
      >
        <View style={{ bottom: util.WP("30") }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ addListModal: false });
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require("../../../assets/close-round.png")}
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

  ModalToggler = () => {
    this.setState({ addListModal: !this.state.addListModal });
    this.setState({ bottomDrop: false });
  };

  handlecategoryClick = (category, dept_id, subdept_id) => {
    console.log("CATEGORY", category);
    this.setState({ searchTerm: null, overlayId: null, localSearching: false });
    console.log("products", category);
    this.setState(
      { searchItems: category.products, category: category },
      () => {
        console.log("search ITEMS", this.state.searchItems);
        let _searchItems = [...this.state.searchItems];
        console.log("check kro", _searchItems);
        if (this.state.activeList) {
          this.props.fetchedLists.map((list) => {
            if (list.id === this.state.activeList) {
              _searchItems.map((item, index) => {
                list.products?.map((product) => {
                  if (item.id == product.id) {
                    console.log("list product", product);
                    item.quantity = product.pivot.product_quantity;
                  } else {
                    if (item.is_scalable) {
                      if (item.is_scalable && !item.size.includes("CT")) {
                        let _measureUnit = item.size;
                        let _price = null;
                        if (
                          _measureUnit === "KG" ||
                          _measureUnit.includes("KG")
                        ) {
                          _price = parseFloat(
                            item.unit_retail / 2.20462
                          ).toFixed(2);
                        }
                        if (_measureUnit === "G") {
                          _price = parseFloat(
                            item.unit_retail / 453.59237
                          ).toFixed(2);
                        }
                        if (_measureUnit.includes("OZ")) {
                          _price = parseFloat(item.unit_retail / 16).toFixed(2);
                        }
                        if (_measureUnit.includes("lb")) {
                          _price = item.unit_retail;
                        }
                        item.size = "lb";
                        item.unit_retail = _price;
                        item.quantity = 0.25;
                      } else {
                        item.quantity = 1;
                      }
                    } else {
                      item.quantity = 1;
                    }
                  }
                });
              });
            }
          });
          this.setState({ searchItems: _searchItems });
          console.log("items", _searchItems);
          this.setState({ page: 1 }, () => {
            this.pagination();
          });
        } else {
          let _searchItems = [...this.state.searchItems];
          _searchItems.map((item) => {
            // let _item = item
            if (item.is_scalable) {
              if (item.is_scalable && !item.size.includes("CT")) {
                let _measureUnit = item.size;
                let _price = null;
                if (_measureUnit === "KG" || _measureUnit.includes("KG")) {
                  _price = parseFloat(item.unit_retail / 2.20462).toFixed(2);
                }
                if (_measureUnit === "G") {
                  _price = parseFloat(item.unit_retail / 453.59237).toFixed(2);
                }
                if (_measureUnit.includes("OZ")) {
                  _price = parseFloat(item.unit_retail / 16).toFixed(2);
                }

                if (_measureUnit.includes("lb")) {
                  _price = item.unit_retail;
                }

                item.size = "lb";
                item.unit_retail = _price;
                item.quantity = 0.25;
              } else {
                item.quantity = 1;
              }
            } else {
              item.quantity = 1;
            }
            // return _item
          });

          this.setState({ searchItems: _searchItems });
          this.setState({ page: 1 }, () => {
            this.pagination();
          });
        }
      }
    );
    // const data = {
    //   category_id: category.id,
    //   department_id: dept_id,
    //   sub_department: subdept_id,
    // };
    // this.props.categoryProducts(data);
    // this.setState({ category: category, searchItems: null });
  };
  goToCheckout() {
    console.log("list items after get", this.state.fetchedListItems);
    if (this.state.fetchedListItems) {
      let _orderProducts = [];
      if (this.state.fetchedListItems.products.length) {
        _orderProducts = this.state.fetchedListItems.products;
        _orderProducts.map((product, index) => {
          console.log("products", product);
          _orderProducts[index].stockQuantity = "0";
          if (product.is_scalable) {
            if (product.is_scalable && !product.size.includes("CT")) {
              let _measureUnit = product.size;
              let _price = null;
              if (_measureUnit === "KG" || _measureUnit.includes("KG")) {
                _price = parseFloat(product.unit_retail / 2.20462).toFixed(2);
              }
              if (_measureUnit === "G") {
                _price = parseFloat(product.unit_retail / 453.59237).toFixed(2);
              }
              if (_measureUnit.includes("OZ")) {
                _price = parseFloat(product.unit_retail / 16).toFixed(2);
              }
              _orderProducts[index].size = "lb";
              _orderProducts[index].unit_retail = _price;
            }
          }
          _orderProducts[index].quantity = product.pivot.product_quantity;
          _orderProducts[index].checkoutPrice = parseFloat(
            product.pivot.product_quantity * _orderProducts[index].unit_retail
          );
        });
      }
      let _bundles = [];
      this.props.fetchedListItems.bundles?.map((data) => {
        if (data.type == "mix_and_match") {
          if (data.mix_and_match_type == "different_cost_products") {
            let _data = data;
            let _buyProducts = [];
            let _freeProducts = [];
            let _bundle_price = 0;
            _data.mix_n_match_products_added_to_list.map((selectedProduct) => {
              if (selectedProduct.type == "buy") {
                _data.products.map((actualProduct) => {
                  if (actualProduct.product_id == selectedProduct.product_id) {
                    _bundle_price +=
                      Number(actualProduct.price) * selectedProduct.quantity;
                    actualProduct.quantity = selectedProduct.quantity;
                    _buyProducts.push(actualProduct);
                  }
                });
              } else {
                _data.products.map((actualProduct) => {
                  if (actualProduct.product_id == selectedProduct.product_id) {
                    actualProduct.quantity = selectedProduct.quantity;
                    _freeProducts.push(actualProduct);
                  }
                });
              }
            });
            _data.buyProducts = _buyProducts;
            _data.freeProducts = _freeProducts;
            _data.bundle_price = _bundle_price;
            _bundles.push(_data);
          } else {
            let _data = data;
            let _productsToShow = [];
            let _bundlePrice = 0;
            _data.mix_n_match_products_added_to_list.map((selectedProduct) => {
              _data.products.map((actualProduct) => {
                if (actualProduct.product_id == selectedProduct.product_id) {
                  actualProduct.quantity = selectedProduct.quantity;
                  _bundlePrice +=
                    +actualProduct.price * +selectedProduct.quantity;
                  _productsToShow.push(actualProduct);
                }
              });
            });
            _data.buyProducts = _productsToShow;
            let _priceToDeduct =
              +_productsToShow[0].price * +_data.selection_quantity;
            _data.bundle_price = _bundlePrice - _priceToDeduct;
            _bundles.push(_data);
          }
        } else {
          _bundles.push(data);
        }
      });
      let _order = {
        total_price: "",
        card_number: "",
        delivery_details: {
          store_id: "1",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address_line_1: "",
          address_line_2: "",
          delivery_method: "curbside",
          license_plate_number: "",
        },
        products: _orderProducts,
        bundles: _bundles,
      };
      console.log("order", _order);
      this.props.addOrderProducts(_order);
      this.props.navigation.navigate("DeliveryNotices");
    } else {
      util.showToast("Add Products To List");
    }
  }
  orderNow() {
    if (this.state.activeList) {
      this.props.getListItemsBundles(this.state.activeList);
    }
  }
  handleProductPress = (product) => {
    let _product = product;
    _product.name = product.desc;
    this.setState({
      productID: _product.id,
      stockInfoModalIsVisible: true,
      stockProduct: _product,
    });
  };

  closeStockModal = (isVisible) => {
    this.setState({
      stockInfoModalIsVisible: !this.state.stockInfoModalIsVisible,
    });
  };
  openproductOverlay = () => {
    this.setState({ overlayId: this.state.productID });
    this.setState({
      stockInfoModalIsVisible: !this.state.stockInfoModalIsVisible,
    });
  };
  setOverlayId = (pId) => {
    this.setState({ overlayId: pId }, () => {});
  };
  renderOverlay = (rowData, index) => {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          marginBottom: util.WP(1.8),
          paddingHorizontal: util.WP(6.3),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: util.WP(3.6),
                fontFamily: "Montserrat-Light",
                borderBottomColor: "#aaaaaa",
                borderBottomWidth: 1,
                paddingBottom: util.WP(2),
              }}
            >
              Quantity:
              <Text
                style={{
                  fontFamily: "Montserrat-Bold",
                }}
              >
                {rowData.quantity}
              </Text>
              {rowData.is_scalable ? (
                <Text
                  style={{
                    fontFamily: "Montserrat-Medium",
                    marginLeft: 3,
                  }}
                >
                  {rowData.size}
                </Text>
              ) : null}
            </Text>

            <Text
              style={{
                fontSize: util.WP(3.6),
                fontFamily: "Montserrat-Light",
                borderBottomColor: "#aaaaaa",
                borderBottomWidth: 1,
                paddingBottom: util.WP(2),
                marginLeft: util.WP(3),
              }}
            >
              Price:{" "}
              <Text
                style={{
                  fontFamily: "Montserrat-Bold",
                }}
              >
                ${parseFloat(rowData.quantity * rowData.unit_retail).toFixed(2)}
              </Text>
            </Text>
          </View>
          <View style={{ paddingBottom: util.WP(2) }}>
            <TouchableOpacity
              onPress={() => this.setState({ overlayId: null })}
            >
              <Image
                source={require("../../../assets/close.png")}
                style={{
                  width: util.WP(7),
                  height: util.WP(7),
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            // justifyContent: 'space-between',
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              //marginTop: util.WP(2),
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => this.decreseQuantity(rowData.id, "search")}
            >
              <View
                style={{
                  width: util.WP(7.2),
                  height: util.WP(7.2),
                  backgroundColor: "#fdda00",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: util.WP(8),
                    fontFamily: "Montserrat-Bold",
                    lineHeight: util.WP(8),
                  }}
                >
                  -
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <Text
              style={{
                marginHorizontal: util.WP(3),
                fontSize: util.WP(4.8),
                fontFamily: "Montserrat-Bold",
                lineHeight: util.WP(4.8),
              }}
            >
              {rowData.quantity
                ? rowData.quantity
                : 1 /*rowData.quantity
                                      ? rowData.quantity % 1 != 0
                                        ? rowData.quantity.toFixed(2)
                                        : rowData.quantity
                                      : rowData.size.split(' ')[0]*/}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => this.increseQuantity(rowData.id, index)}
            >
              <View
                style={{
                  width: util.WP(7.2),
                  height: util.WP(7.2),
                  backgroundColor: "#fdda00",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: util.WP(7),
                    fontFamily: "Montserrat-Bold",
                    lineHeight: util.WP(7.5),
                  }}
                >
                  +
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{ marginLeft: util.WP(20) }}>
            <TouchableWithoutFeedback
              onPress={() =>
                // this.setState({
                //   bottomDrop: true,
                //   productObj: rowData,
                // })
                this.addProductToList(rowData)
              }
            >
              <View
                style={{
                  backgroundColor: "#32c0f9",
                  width: util.WP(7.6),
                  height: util.WP(7.3),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../assets/rightarrow.png")}
                  style={{
                    width: util.WP(2.3),
                    resizeMode: "contain",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };
  // _scrollToIndex = () => {
  //   this.refs.flatListRef.scrollToIndex({animated: true,index:5});
  // }
  onLayout() {
    this.list.scrollToIndex({ index: this.state.catIndex });
  }

  // promotion button
  handlePromotionButton(params) {
    this.setState({ loader: true });
    this.props.getPoductCoupon(params);
    this.setState({ promotionModal: true, loader: false });
  }

  navigateToCouponDetails(coupon_id) {
    var params = {
      coupon_id: coupon_id,
      routeParam: "CategoryList",
    };
    util.isOnline(
      () => {
        this.setState({ promotionModal: false });
        this.props.GetShopCouponDetails(params);
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }
  _couponsModal() {
    return (
      <Modal isVisible={this.state.promotionModal} useNativeDriver={true}>
        <View style={{ flex: 1 }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => this.setState({ promotionModal: false })}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require("../../../assets/close-round.png")}
              />
            </TouchableOpacity>
          </View>
          {this.props.ShopLoader ? (
            <Image
              style={{
                width: "100%",
                height: util.HP(25),
              }}
              source={require("../../../assets/clientBrand.gif")}
            />
          ) : (
            <View>
              <View
                style={{
                  backgroundColor: "#00adee",
                  height: util.WP(15),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: util.WP(5),
                    fontFamily: "Montserrat-Bold",
                    // paddingTop: 5,
                    // borderBottomWidth: 1,
                    // borderBottomColor: "#ccc",
                    // borderStyle: "solid",
                    paddingBottom: 5,
                  }}
                >
                  Promotions
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderStyle: "solid",
                  elevation: 20,
                }}
              >
                <View>
                  <FlatList
                    data={this.props.productCoupons}
                    showsHorizontalScrollIndicator={false}
                    numColumns={2}
                    renderItem={({ item: rowData }) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            this.navigateToCouponDetails(rowData.coupon_id)
                          }
                        >
                          <Card
                            title={null}
                            containerStyle={{
                              ...styles.couponCard,
                              marginTop: 0,
                              height: "auto",
                              paddingHorizontal: util.WP(2.9),
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "flex-start",
                              }}
                            >
                              <FastImage
                                source={{
                                  uri: rowData.image ? rowData.image : "",
                                  priority: FastImage.priority.normal,
                                }}
                                style={{
                                  width: "100%",
                                  height: util.WP(25),
                                  marginBottom: 5,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </View>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                numberOfLines={2}
                                style={{
                                  ...styles.h1Title,
                                  fontSize: util.WP(3),
                                  width: "100%",
                                  paddingTop: 0,
                                  minHeight: util.WP(10),
                                }}
                              >
                                {rowData.title}
                              </Text>
                            </View>
                            <View>
                              <Text numberOfLines={3} style={styles.cardDetail}>
                                {rowData.short_description}
                              </Text>
                            </View>
                          </Card>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  }
  render() {
    const { promotions, navigation } = this.props;
    const { localSearching, category, department, subDepartment } = this.state;
    if (this.state.isMounted) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#f2f2f2",
            justifyContent: "space-between",
          }}
        >
          {this.state.stockInfoModalIsVisible && (
            <ProductStockInfoModal
              isVisible={this.state.stockInfoModalIsVisible}
              product={this.state.stockProduct}
              closeModal={this.closeStockModal}
              selectToAdd={this.openproductOverlay}
            />
          )}
          <View style={{ flexGrow: 1, flex: 1 }}>
            <View
              style={{
                ...styles.lightBlueContainerMedium,
                height:
                  util.isIphoneX() || util.isIphoneXSM()
                    ? util.WP("20")
                    : util.WP("23.5"),
                zIndex: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: 20,
                  marginRight: 25,
                  marginTop: util.HP(2),
                }}
              >
                <Text style={{ ...styles.h1ListTitle, fontSize: util.WP(5) }}>
                  {subDepartment.name}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                bottom: util.WP(15) / 2,
                marginHorizontal: util.WP(5),
                height: util.WP(10),
                width: "auto",
                zIndex: 100,
              }}
            >
              <TouchableOpacity
                style={{
                  width: util.WP(15.3),
                  height: util.WP(12),
                  backgroundColor: "#00355F",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: util.WP(3),
                  zIndex: 5,
                  elevation: 1,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 1,
                    height: 5,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                }}
                onPress={() => navigation.navigate("Scan")}
              >
                <Image
                  source={require("../../../assets/scan-white.png")}
                  style={{ width: util.WP(5), height: util.WP(5) }}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Montserrat-Medium",
                    fontSize: util.WP(2.2),
                    marginTop: 2,
                  }}
                >
                  Scan
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  display: "flex",
                  zIndex: 5,
                  alignItems: "center",
                  height: util.WP(12),
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  paddingLeft: util.WP(5),
                  paddingRight: util.WP(10),
                  marginTop: 0,
                  marginBottom: 0,
                  flex: 1,
                  elevation: 1,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 1,
                    height: 5,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                }}
              >
                <Image
                  style={{
                    height: util.WP(5),
                    width: util.WP(5),
                    marginRight: util.WP("2"),
                  }}
                  resizeMode="contain"
                  source={require("../../../assets/search-blue.png")}
                />
                <TextInput
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    color: "#00355F",
                    fontSize: util.WP(4),
                    width: "100%",
                    height: "100%",
                  }}
                  placeholder={"Search"}
                  placeholderTextColor="#00355F"
                  value={this.state.searchTerm}
                  onChangeText={(text) => this.triggerSearch(text)}
                />
              </View>
            </View>
            <View style={{ marginTop: util.WP(1) }}>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.categories}
                ref={(el) => (this.list = el)}
                keyExtractor={(item, index) => String(index)}
                extraData={this.state.catIndex}
                getItemLayout={(data, index) => ({
                  length: WIDTH / 5,
                  offset: (WIDTH / 5) * index,
                  index,
                })}
                snapToAlignment={"center"}
                snapToInterval={WIDTH / 5}
                renderItem={({ item: cat, index }) => {
                  return (
                    <View onLayout={() => this.onLayout()}>
                      <TouchableOpacity
                        onPress={() => this.handlecategoryClick(cat)}
                        style={{}}
                      >
                        <Text
                          style={{
                            marginHorizontal: util.WP(5),
                            fontFamily: "Montserrat-SemiBold",

                            color:
                              category.id === cat.id ? "#115281" : "#2bb4e6",
                            borderBottomColor: "#fdda00",
                            marginBottom: 20,
                            marginLeft: 20,
                            fontSize: util.WP(3),
                          }}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>

            {!this.props.lumperShown ? (
              this.state.products && this.state.products.length > 0 ? (
                <FlatList
                  data={this.state.products}
                  bounces={false}
                  scrollEventThrottle={16}
                  keyExtractor={(item, index) => String(index)}
                  ListFooterComponent={this.renderFooter}
                  onEndReached={() => this.incrementPage()}
                  onEndReachedThreshold={0.5}
                  extraData={this.state.refresh}
                  progressViewOffset={10}
                  renderItem={({ item: rowData, index }) => {
                    return (
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            backgroundColor: "#fff",
                            height: "auto",
                            paddingTop: util.WP(1),
                            paddingBottom: util.WP(1),
                            paddingHorizontal: util.WP(1),
                            marginBottom: util.WP(1),
                            borderBottomWidth: 1,
                            borderBottomColor: "#f2f2f2",
                            marginLeft: util.WP(2),
                            width: "95%",
                          }}
                        >
                          <View>
                            {rowData.images?.length ? (
                              <FastImage
                                source={{
                                  uri: rowData.images[0],
                                  priority: FastImage.priority.normal,
                                }}
                                style={{
                                  width: util.WP(15),
                                  height: util.WP(15),
                                  marginRight: util.WP(1.5),
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            ) : (
                              <Image
                                source={require("../../../assets/noimage2.png")}
                                style={{
                                  width: util.WP(15),
                                  height: util.WP(18),
                                  resizeMode: "contain",
                                  marginRight: util.WP(1.5),
                                }}
                              />
                            )}
                          </View>
                          <View style={{ width: "100%" }}>
                            <View style={{ width: "80%" }}>
                              <Text
                                style={{
                                  fontSize: util.WP(3),
                                  fontFamily: "Montserrat-Bold",
                                  flex: 1,
                                  flexWrap: "wrap",
                                }}
                              >
                                {rowData.desc}
                              </Text>

                              <Text
                                style={{
                                  fontSize: util.WP(3),
                                  fontFamily: "Montserrat-Light",
                                }}
                              >
                                {rowData.is_scalable ? (
                                  <Text
                                    style={{
                                      fontFamily: "Montserrat-Bold",
                                      fontSize: util.WP(3),
                                    }}
                                  >
                                    Per{" "}
                                  </Text>
                                ) : null}
                                {rowData.size}
                              </Text>
                            </View>

                            <View
                              style={{
                                width: "80%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <View>
                                <Text
                                  style={{
                                    fontSize: util.WP(4),
                                    fontFamily: "Montserrat-SemiBold",
                                  }}
                                >
                                  ${rowData.unit_retail}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                              >
                                <View style={{ marginHorizontal: util.WP(3) }}>
                                  {this.props.fetchedLists &&
                                  this.props.fetchedLists.length &&
                                  this.props.fetchedLists.find(
                                    (list) => list.id === this.state.activeList
                                  ) ? (
                                    this.props.fetchedLists
                                      .find(
                                        (list) =>
                                          list.id === this.state.activeList
                                      )
                                      .products?.some(
                                        (product) => product.id === rowData.id
                                      ) ? (
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <View />
                                        <View style={{ marginTop: 2 }}>
                                          {this.props.fetchedLists.map(
                                            (list) => {
                                              if (
                                                list.id ===
                                                this.state.activeList
                                              ) {
                                                return list.products.map(
                                                  (product) => {
                                                    if (
                                                      product.id === rowData.id
                                                    ) {
                                                      return (
                                                        <Text
                                                          key={product.id.toString()}
                                                          style={{
                                                            marginHorizontal: util.WP(
                                                              1
                                                            ),
                                                            fontSize: util.WP(
                                                              4
                                                            ),
                                                            fontFamily:
                                                              "Montserrat-Bold",
                                                          }}
                                                        >
                                                          {
                                                            product.pivot
                                                              .product_quantity
                                                          }{" "}
                                                          {rowData.is_scalable ? (
                                                            <Text
                                                              style={{
                                                                fontFamily:
                                                                  "Montserrat-Bold",
                                                                fontSize: util.WP(
                                                                  4
                                                                ),
                                                                color:
                                                                  "#fc7401",
                                                              }}
                                                            >
                                                              {rowData.size}
                                                            </Text>
                                                          ) : null}
                                                        </Text>
                                                      );
                                                    }
                                                  }
                                                );
                                              }
                                            }
                                          )}
                                        </View>
                                        <View>
                                          <TouchableOpacity
                                            onPress={() =>
                                              this.setState({
                                                overlayId: rowData.id,
                                              })
                                            }
                                            style={{
                                              width: util.WP(15.5),
                                              height: util.WP(6.9),
                                              borderColor: "#fdda00",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderWidth: util.WP(0.6),
                                            }}
                                          >
                                            <Text
                                              style={{
                                                fontSize: util.WP(3.6),
                                                fontFamily: "Montserrat-Medium",
                                                color: "#444444",
                                              }}
                                            >
                                              Added
                                            </Text>
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.setState({
                                            overlayId: rowData.id,
                                          })
                                        }
                                        style={{
                                          width: util.WP(15),
                                          height: util.WP(6),
                                          backgroundColor: "#fcd605",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: util.WP(3.6),
                                            fontFamily: "Montserrat-Medium",
                                          }}
                                        >
                                          Add +
                                        </Text>
                                      </TouchableOpacity>
                                    )
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.setState({ overlayId: rowData.id })
                                      }
                                      style={{
                                        width: util.WP(15),
                                        height: util.WP(6),
                                        backgroundColor: "#fcd605",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: util.WP(3.6),
                                          fontFamily: "Montserrat-Medium",
                                        }}
                                      >
                                        Add +
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.handleProductPress(rowData)
                                    }
                                  >
                                    <View
                                      style={{
                                        width: util.WP(10),
                                        height: util.WP(6),
                                        backgroundColor: "#fcd605",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Image
                                        source={require("../../../assets/view.png")}
                                        style={{
                                          width: util.WP(4),
                                          height: util.WP(4),
                                          resizeMode: "contain",
                                        }}
                                      />
                                    </View>
                                  </TouchableOpacity>
                                  {rowData.is_promotional ? (
                                    <TouchableOpacity
                                      style={{ marginLeft: 10 }}
                                      onPress={() =>
                                        this.handlePromotionButton(
                                          rowData.related_coupons
                                        )
                                      }
                                    >
                                      <View
                                        style={{
                                          width: util.WP(11),
                                          height: util.WP(6),
                                          backgroundColor: "#fc7401",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: util.WP(3.6),
                                            fontFamily: "Montserrat-Medium",
                                            color: "#fff",
                                          }}
                                        >
                                          SAVE
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  ) : null}
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                        {this.state.overlayId === rowData.id
                          ? this.renderOverlay(rowData, index)
                          : null}
                      </View>
                    );
                  }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: util.WP(30),
                  }}
                >
                  <Text
                    style={{
                      fontSize: util.WP(4),
                      fontFamily: "Montserrat-Bold",
                      color: "#000",
                      textAlign: "center",
                      paddingHorizontal: util.WP(7),
                    }}
                  >
                    No Items found in this category
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.state.params.returnData(
                        this.state.searchTerm ? this.state.searchTerm : ""
                      );
                      this.props.navigation.goBack();
                    }}
                    style={{
                      ...styles.containerButton,
                      width: "30%",
                      padding: 10,
                      margixLeft: 5,
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: util.WP(3),
                        fontFamily: "Montserrat-SemiBold",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      Search All
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View
                style={{
                  position: "absolute",
                  top:
                    util.isIphoneX() || util.isIphoneXSM()
                      ? util.WP("26")
                      : util.WP("23.5"),
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <Image
                  style={{
                    width: "100%",
                    height: util.HP(25),
                  }}
                  source={require("../../../assets/clientBrand.gif")}
                />
              </View>
            )}
          </View>
          {this.modalAddList()}
          <View>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({ bottomDrop: !this.state.bottomDrop })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: util.WP(4.9),
                    paddingVertical: util.WP(5),
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    backgroundColor: "#26ACE1",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width:
                      this.state.activeList &&
                      this.props.orderData.order_service_status
                        ? "75%"
                        : "100%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {this.props.fetchedLists &&
                    this.props.fetchedLists.length &&
                    this.state.activeList &&
                    this.props.fetchedLists.find(
                      (list) => list.id === this.state.activeList
                    ) &&
                    this.props.fetchedLists.find(
                      (list) => list.id === this.state.activeList
                    ).products ? (
                      <Text
                        style={{
                          color: "#fcd605",
                          fontSize: util.WP(4.8),
                          fontFamily: "Montserrat-Bold",
                        }}
                      >
                        (
                        {this.props.fetchedLists.map((list) => {
                          if (list.id == this.state.activeList) {
                            return list.products.length + list.coupon_count;
                          }
                        })}
                        )
                      </Text>
                    ) : (
                      <Image
                        source={require("../../../assets/list.png")}
                        style={{
                          width: util.WP(5),
                          height: util.WP(6),
                          resizeMode: "contain",
                        }}
                      />
                    )}

                    <Text
                      style={{
                        fontSize: util.WP(3.6),
                        color: "#fff",
                        fontFamily: "Montserrat-SemiBold",
                        marginLeft: util.WP(2),
                      }}
                    >
                      {this.state.activeList &&
                      this.props.fetchedLists &&
                      this.props.fetchedLists.length
                        ? this.props.fetchedLists.find(
                            (item) => item.id === this.state.activeList
                          )
                          ? this.props.fetchedLists.find(
                              (item) => item.id === this.state.activeList
                            ).name
                          : "Select list or Create new to add items"
                        : "Select list or Create new to add items"}
                    </Text>
                  </View>

                  <View>
                    <Image
                      source={require("../../../assets/up_arrow.png")}
                      style={{
                        width: util.WP(4),
                        height: util.WP(2.6),
                        resizeMode: "contain",
                        transform: [
                          {
                            rotate: !this.state.bottomDrop ? "0deg" : "-180deg",
                          },
                        ],
                      }}
                    />
                  </View>
                </View>
                {this.state.activeList &&
                  this.props.orderData.order_service_status && (
                    <View
                      style={{
                        paddingHorizontal: util.WP(4),
                        paddingVertical: util.WP(5),
                        borderTopLeftRadius: 15,
                        // borderTopRightRadius: 15,
                        backgroundColor: "#fc7401",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "20%",
                      }}
                    >
                      <TouchableOpacity onPress={() => this.orderNow()}>
                        <Text
                          style={{
                            fontFamily: "Montserrat-Bold",
                            color: "#fff",
                            fontSize: util.WP(2.6),
                          }}
                        >
                          ORDER NOW!
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
              </View>
            </TouchableWithoutFeedback>

            <View
              style={{
                height: this.state.bottomDrop ? "auto" : 0,
                backgroundColor: "#f2f2f2",
              }}
            >
              <View
                style={{
                  paddingHorizontal: util.WP(7),
                  paddingTop: util.WP(2),
                  zIndex: 5,
                }}
              >
                <ScrollView style={{ height: util.WP(60) }}>
                  {this.props.fetchedLists && this.props.fetchedLists.length > 0
                    ? this.props.fetchedLists.map((list) => {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            key={list.id}
                            onPress={() => this.props.setActiveList(list.id)}
                          >
                            <Text
                              style={{
                                fontSize: util.WP(3.6),
                                fontFamily: "Montserrat-Medium",
                                borderBottomWidth: 1,
                                paddingTop: util.WP(4.7),
                                paddingBottom: util.WP(4.7),
                                color: "#444444",
                                borderBottomColor: "#a1a1a1",
                              }}
                            >
                              {list.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    : null}
                </ScrollView>
                <TouchableOpacity
                  style={{ marginTop: util.WP(9), marginBottom: util.WP(6) }}
                  onPress={() => this.ModalToggler()}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={require("../../../assets/yellow-plus.png")}
                      style={{
                        width: util.WP(3.6),
                        height: util.WP(3.6),
                        transform: [
                          { rotate: this.state.bottomDrop ? "180deg" : "0deg" },
                        ],
                      }}
                    />
                    <Text
                      style={{
                        marginLeft: util.WP(3.7),
                        fontSize: util.WP(4.8),
                        fontFamily: "Montserrat-Medium",
                        color: "#fc7401",
                      }}
                    >
                      Create new list
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {this._couponsModal()}
        </View>
      );
    } else {
      return (
        <View
          style={{
            position: "absolute",
            top:
              util.isIphoneX() || util.isIphoneXSM()
                ? util.WP("26")
                : util.WP("23.5"),
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(255,255,255,0.9)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Image
            style={{
              width: "100%",
              height: util.HP(25),
            }}
            source={require("../../../assets/clientBrand.gif")}
          />
        </View>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    isLoadingListItems: state.ui.isLoadingListItems,
    fetchedListItems: state.Lists.fetchedListItems,
    isGuestUser: state.login.isGuestUser,
    promotions: state.promotions.promotions,
    searchItems: state.Lists.searchItems,
    user: state.login.user,
    departments: state.Lists.departments,
    fetchedLists: state.Lists.fetchedLists,
    activeList: state.Lists.activeList,
    ShopListItems: state.Lists.ShopListItems,
    orderData: state.Lists.orderData,
    productCoupons: state.shop.Coupons,
    ShopLoader: state.shop.ShopLoader,
    ShopCatLoader: state.shop.ShopCatLoader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ShopSearch: (param) => dispatch(TASKS.ShopSearch(param)),
    clearSearchItems: () => dispatch(TASKS.clearSearchItems()),
    ShopaddListItem: (params) => dispatch(TASKS.ShopaddListItem(params)),
    setActiveList: (id) => dispatch(TASKS.setActiveList(id)),
    getListItemsBundles: (id) => dispatch(TASKS.getListItemsBundles(id)),
    getOrderStatus: () => dispatch(TASKS.getOrderStatus()),
    addNewObjectListBackend: (addParams) =>
      dispatch(TASKS.addNewObjectListBackend(addParams)),
    fetchLists: (callType) => dispatch(TASKS.fetchLists(callType)),
    categoryProducts: (id, dept_id, subdept_id) =>
      dispatch(TASKS.categoryProducts(id, dept_id, subdept_id)),
    addOrderProducts: (orderProducts) =>
      dispatch(TASKS.addOrderProducts(orderProducts)),
    getPoductCoupon: (data) => dispatch(TASKS.fetchShopCoupon(data)),
    GetShopCouponDetails: (data) => dispatch(TASKS.getShopCoupondetails(data)),
    categoryProductsPaginated: (data) =>
      dispatch(TASKS.categoryProductsPaginated(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(categoryList);
