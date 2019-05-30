sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"../Formatter"
], function(Controller, Filter, Sorter, JSONModel, MessageToast, MessageBox, Formatter) {
	"use strict";

	return Controller.extend("com.ui5ProductsManagement.controller.Products", {

		onInit: function() {

		},

		onFilterSearch: function(oEvent) {
			//Filter Search handler
			var inPrdId = this.getView().byId("idPrdId").getValue();
			var inPrdName = this.getView().byId("idPrdName").getValue();
			var inPrdStatus = this.getView().byId("idPrdStatus").getSelectedKey();
			var inCreatedDate = this.getView().byId("idCreatedDate").getValue();
			var inPrdType = this.getView().byId("idPrdType").getValue();
			var inStockQty = this.getView().byId("idStockQty").getValue();
			var inWareTransStatus = this.getView().byId("idWareTransStatus").getSelectedKey();
			var inPackagingStatus = this.getView().byId("idPackagingStatus").getSelectedKey();

			var aFilters = [];
			//add all the filters
			if (inPrdId && inPrdId.length > 0) {
				var inPrdIdFilter = new Filter("id", sap.ui.model.FilterOperator.Contains, inPrdId);
				aFilters.push(inPrdIdFilter);
			}
			if (inPrdName && inPrdName.length > 0) {
				var inPrdNameFilter = new Filter("name", sap.ui.model.FilterOperator.Contains, inPrdName);
				aFilters.push(inPrdNameFilter);
			}
			if (inPrdStatus && inPrdStatus.length > 0) {
				var inPrdStatusFilter = new Filter("prdStatus", sap.ui.model.FilterOperator.Contains, inPrdStatus);
				aFilters.push(inPrdStatusFilter);
			}
			if (inCreatedDate && inCreatedDate.length > 0) {
				var inCreatedDateFilter = new Filter("createdDate", sap.ui.model.FilterOperator.Contains, inCreatedDate);
				aFilters.push(inCreatedDateFilter);
			}
			if (inPrdType && inPrdType.length > 0) {
				var inPrdTypeFilter = new Filter("type", sap.ui.model.FilterOperator.Contains, inPrdType);
				aFilters.push(inPrdTypeFilter);
			}
			if (inStockQty && inStockQty.length > 0) {
				var inStockQtyFilter = new Filter("stockQty", sap.ui.model.FilterOperator.Contains, inStockQty);
				aFilters.push(inStockQtyFilter);
			}
			if (inWareTransStatus && inWareTransStatus.length > 0) {
				var inWareTransStatusFilter = new Filter("wareTransfStatus", sap.ui.model.FilterOperator.Contains, inWareTransStatus);
				aFilters.push(inWareTransStatusFilter);
			}
			if (inPackagingStatus && inPackagingStatus.length > 0) {
				var inPackagingStatusFilter = new Filter("packingStatus", sap.ui.model.FilterOperator.Contains, inPackagingStatus);
				aFilters.push(inPackagingStatusFilter);
			}
			//update bindings
			var list = this.byId("idPrdList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},

		onLiveSearch: function(oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = [
					new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery)
				];
				aFilters = new sap.ui.model.Filter(filter, false);
			}
			// update list binding
			var list = this.byId("idPrdList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},

		handleSortButtonPressed: function() {
			//sort button handler
			this._createSortsDialog("com.ui5ProductsManagement.view.sortDialog").open();
		},

		_createSortsDialog: function(sDialogFragmentName) {
			//create sort dialog
			if (!this._oSortDialog) {
				// create dialog via fragment factory
				this._oSortDialog = sap.ui.xmlfragment(this.getView().getId(), sDialogFragmentName, this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(this._oSortDialog);
			}
			return this._oSortDialog;
		},

		handleSortDialogConfirm: function(oEvent) {
			//sort dialog confirm
			var oList = this.byId("idPrdList"),
				mParams = oEvent.getParameters(),
				oBinding = oList.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},

		onCreate: function(oEvent) {
			//show create Dialog
			this._getCreateDialog().open();

		},

		_getCreateDialog: function() {
			// create dialog lazily
			if (!this._createDialog) {
				// create dialog via fragment factory
				this._createDialog = sap.ui.xmlfragment(this.getView().getId(), "com.ui5ProductsManagement.view.createProduct", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(this._createDialog);
			}
			return this._createDialog;
		},

		closCreateeDialog: function() {
			//close the dialog
			this._createDialog.close();
		},

		createProduct: function(oEvent) {
			//create operation logic
			var date = new Date();
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				pattern: "dd/MM/yyyy"
			});
			var ctrlObj = this;
			var oModel = this.getView().getModel("products");
			if (ctrlObj.byId("idCPrdID").getValue() != "" && ctrlObj.byId("idCPrdName").getValue() != "" && ctrlObj.byId("idCPrdType").getValue() !=
				"" && ctrlObj.byId("idCStockQty").getValue() != "") {
				oModel.getData().ProductList.push({
					id: ctrlObj.byId("idCPrdID").getValue(),
					name: ctrlObj.byId("idCPrdName").getValue(),
					type: ctrlObj.byId("idCPrdType").getValue(),
					stockQty: ctrlObj.byId("idCStockQty").getValue(),
					prdStatus: ctrlObj.byId("idCPrdStatus").getSelectedKey(),
					wareTransfStatus: ctrlObj.byId("idCWareTransStatus").getSelectedKey(),
					packingStatus: ctrlObj.byId("idCPackStatus").getSelectedKey(),
					createdDate: oDateFormat.format(date)
				});
				oModel.refresh();
				MessageToast.show("Create Successful");
				//close the dialog
				this._createDialog.close();
			} else {
				MessageToast.show("Please fill all the fields first.");
			}
		},

		onUpdate: function(oEvent) {
			//show update dialog
			var ctrlObj = this;
			var contexts = this.getView().byId("idPrdList").getSelectedContexts();
			if (contexts.length === 0) {
				MessageToast.show("Select a Product First");
			} else {
				this._getUpdateDialog().open();
				contexts.map(function(c) {
					ctrlObj.byId("idUPrdID").setText(c.getObject().id);
					ctrlObj.byId("idUPrdName").setValue(c.getObject().name);
					ctrlObj.byId("idUPrdType").setValue(c.getObject().type);
					ctrlObj.byId("idUStockQty").setValue(c.getObject().stockQty);
					ctrlObj.byId("idUPrdStatus").setSelectedKey(c.getObject().prdStatus);
					ctrlObj.byId("idUWareTransStatus").setSelectedKey(c.getObject().wareTransfStatus);
					ctrlObj.byId("idUPackStatus").setSelectedKey(c.getObject().packingStatus);
					ctrlObj.byId("idUCraeteDate").setText(c.getObject().createdDate);
				});
			}
		},

		_getUpdateDialog: function() {
			// create dialog lazily
			if (!this._updateDialog) {
				// create dialog via fragment factory
				this._updateDialog = sap.ui.xmlfragment(this.getView().getId(), "com.ui5ProductsManagement.view.updateProduct", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(this._updateDialog);
			}
			return this._updateDialog;
		},

		closUpdateDialog: function() {
			//close the dialog
			this._updateDialog.close();
		},

		updateProduct: function(oEvent) {
			//update operation logic
			var ctrlObj = this;
			var contexts = this.getView().byId("idPrdList").getSelectedContexts();
			var selIndex = contexts[0].getPath().split("/")[2];
			var oModel = this.getView().getModel("products");
			var obj = oModel.getData().ProductList[selIndex];
			if (ctrlObj.byId("idUPrdName").getValue() != "" && ctrlObj.byId("idUPrdType").getValue() != "" && ctrlObj.byId("idUStockQty").getValue() !=
				"") {
				obj.name = ctrlObj.byId("idUPrdName").getValue();
				obj.type = ctrlObj.byId("idUPrdType").getValue();
				obj.stockQty = ctrlObj.byId("idUStockQty").getValue();
				obj.prdStatus = ctrlObj.byId("idUPrdStatus").getSelectedKey();
				obj.wareTransfStatus = ctrlObj.byId("idUWareTransStatus").getSelectedKey();
				obj.packingStatus = ctrlObj.byId("idUPackStatus").getSelectedKey();
				oModel.refresh();
				MessageToast.show("Update Successful");
				this._updateDialog.close();
			} else {
				MessageToast.show("Please fill all the fields first.");
			}
		},

		onDelete: function() {
			//delete logic
			var othis = this;
			var contexts = this.getView().byId("idPrdList").getSelectedContexts();
			if (contexts.length === 0) {
				MessageToast.show("Select a Product First");
			} else {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.warning(
					"Do you really want to Delete this Product?", {
						title: "Delete",
						actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function(sAction) {
							if (sAction == "DELETE") {
								var selIndex = contexts[0].getPath().split("/")[2];
								var oModel = othis.getView().getModel("products");
								oModel.getData().ProductList.splice(selIndex, 1);
								oModel.refresh();
							}
						}
					}
				);
			}
		},

		showChart: function() {
			//show char view
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ProductCharts");
		},

		openProcessFlow: function(oEvent) {
			//show Process flow Dialog
			var contexts = this.getView().byId("idPrdList").getSelectedContexts();
			var ctrlObj = this;
			if (contexts.length === 0) {
				MessageToast.show("Select a Product First");
			} else {
				//show create Dialog
				ctrlObj._getProcessFlowDialog().open();
				//some logic for process flow
				var oProcessFlow = ctrlObj.byId("processflow");
				var selIndex = contexts[0].getPath().split("/")[2];
				var oModel = ctrlObj.getView().getModel("products");
				var obj = oModel.getData().ProductList[selIndex];

				//Set Product Node Values
				if (obj.prdStatus === "Active") {
					oProcessFlow.getNodes()[0].setState("Positive");
				} else {
					oProcessFlow.getNodes()[0].setState("Negative");
				}
				oProcessFlow.getNodes()[0].setStateText(obj.prdStatus);
				oProcessFlow.getNodes()[0].setTitle(obj.name);
				oProcessFlow.getNodes()[0].setTitleAbbreviation(obj.name);
				oProcessFlow.getNodes()[0].setTexts(obj.id);

				//Set Warehouse Node
				if (obj.wareTransfStatus === "Not Started") {
					oProcessFlow.getNodes()[1].setState("Negative");
				} else if (obj.wareTransfStatus === "In Progress") {
					oProcessFlow.getNodes()[1].setState("Neutral");
				} else {
					oProcessFlow.getNodes()[1].setState("Positive");
				}
				oProcessFlow.getNodes()[1].setStateText(obj.wareTransfStatus);

				//set Packaging Node
				if (obj.packingStatus === "Not Started") {
					oProcessFlow.getNodes()[2].setState("Negative");
				} else if (obj.packingStatus === "In Progress") {
					oProcessFlow.getNodes()[2].setState("Neutral");
				} else {
					oProcessFlow.getNodes()[2].setState("Positive");
				}
				oProcessFlow.getNodes()[2].setStateText(obj.packingStatus);

				ctrlObj.byId("processflow").zoomIn();
				ctrlObj.byId("processflow").zoomOut();
				ctrlObj.getView().getModel("processFlow").refresh();
			}
		},

		_getProcessFlowDialog: function() {
			// create dialog lazily
			if (!this._processFlowDialog) {
				// create dialog via fragment factory
				this._processFlowDialog = sap.ui.xmlfragment(this.getView().getId(), "com.ui5ProductsManagement.view.processFlow", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(this._processFlowDialog);
			}
			return this._processFlowDialog;
		},

		closeProcessFlowDialog: function() {
			//close dialog
			this._processFlowDialog.close();
		},

		onZoomIn: function() {
			//zoom in process flow
			this.byId("processflow").zoomIn();
		},

		onZoomOut: function() {
			//zoom out process flow
			this.byId("processflow").zoomOut();
		}

	});
});