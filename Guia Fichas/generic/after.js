this.sheet.getField("ValueRow").getValueFor = function (id) {
	//sheet.getField("ValueRow").sheets[0].getField('ValueColumn').sheets[0].getValueFor("Agilidade")
	for (var i = 0; i < this.sheets.length; i++) {
		var columns = this.sheets[i].getField("ValueColumn");
		for (var k = 0; k < columns.sheets.length; k++) {
			var columnName = columns.sheets[k].getField("ColumnName").getValue().replace(/\s/g, "").latinize().toUpperCase();
			if (columnName === id) {
				return columns.sheets[k].getField("Fields").getValue();
			}
			var value = columns.sheets[k].getValueFor(id);
			if (value !== null) return value;
		}
	}
	return null;
};