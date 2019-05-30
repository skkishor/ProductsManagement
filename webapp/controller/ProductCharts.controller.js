sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function(Controller, ChartFormatter, Format) {
	"use strict";
	return Controller.extend("com.ui5ProductsManagement.controller.ProductCharts", {
		onInit: function() {

			//pie chart setting
			this._configureChart(this.getView().byId("idPieVizFrame"), "Pie Chart");
			//donut char setting
			this._configureChart(this.getView().byId("idDonutVizFrame"), "Donut Chart");
			//column chart setting
			this._configureChart(this.getView().byId("idColumnVizFrame"), "Column Chart");

		},

		_configureChart: function(oVizFrame, chartName) {
			//configure chart
			oVizFrame.setModel(this.getView().getModel("products"));
			oVizFrame.setVizProperties({
				plotArea: {
					colorPalette: d3.scale.category20().range(),
					dataLabel: {
						showTotal: true
					}
				},
				tooltip: {
					visible: true
				},
				title: {
					text: chartName
				}
			});
		},

		onNavButtonPress: function() {
			//back button handler
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Products");
		}
	});
});