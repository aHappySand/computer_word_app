(function ($){
	var DB_PATH;
	var DB_NAME;
    function setConfig(option){
        DB_PATH = option.db_path;
        DB_NAME = option.db_name;
    }
    
	// 打开数据库
	function openDB(){
		return new Promise((resolve, reject) => {
			plus.sqlite.openDatabase({
				name: DB_NAME,
				path: DB_PATH,
				success: function(e){
					console.log('openDatabase success!');
					resolve(e);
				},
				fail: function(e){
					console.log('openDatabase failed: '+JSON.stringify(e));
					reject(e);
				}
			});
		});
	}
	
	function isOpenDatabase(){
		return plus.sqlite.isOpenDatabase({
			name: DB_NAME,
			path: DB_PATH,
		});
	}
	
	// 关闭数据库
	function closeDB(){
		plus.sqlite.closeDatabase({
			name: DB_NAME,
			success: function(e){
				console.log('closeDatabase success!');
			},
			fail: function(e){
				console.log('closeDatabase failed: '+JSON.stringify(e));
			}
		});
	}
	
	//事务
	function transactionDB(operation){
		return new Promise((resolve, reject) => {
			plus.sqlite.transaction({
				name: DB_NAME,
				operation: operation,
				success: function(e){
					console.log('transaction success!');
					resolve(e);
				},
				fail: function(e){
					console.log('transaction failed: '+JSON.stringify(e));
					reject(e);
				}
			});
		});
	}
	
	// 执行事务
	function beginTransactionDB(){
		return transactionDB('begin');
	}
	
	function commitTransactionDB(){
		return transactionDB('commit');
	}
	
	function rollbackTransactionDB(){
		return transactionDB('rollback');
	}
	
	// 执行SQL语句
	function executeSQL(sql){
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: DB_NAME,
				sql: sql,
				success: function(e){
					resolve(e);
				},
				fail: function(e){
					console.log('executeSql failed: '+JSON.stringify(e));
					reject(e);
				}
			});
		});
	}
	
	/**
	 * @param {Object} keyValues
	 * sqlite3数据库在搜索的时候，一些特殊的字符需要进行转义， 具体的转义如下：
	 /   ->    //
	 '   ->    ''
	 [   ->    /[
	 ]   ->    /]
	 %   ->    /%
	 &   ->    /&
	 _   ->    /_
	 (   ->    /(
	 )   ->    /)
	 */
	function escape(str){
		if(typeof str === "string"){
			str = str.replace(/'/g, "''");
			str = str.replace(/\(/g, "（");
			str = str.replace(/\)/g, "）");
			str = str.replace(/;/g, "；");
			str = "'" + str + "'";
		}
		return str;
	}
		
	function getKeyVal(keyValues){

		let arrKey = [],
			arrVal = [];
		for(var k in keyValues){
			arrKey.push(k);
			arrVal.push(escape(keyValues[k]));
		}
		return {
			keys: arrKey,
			values: arrVal
		}
	}
	
	function insert(table, keyValues){//"insert into database values('北京','安乐林','11')",
		keyValues = getKeyVal(keyValues);
		let sql = "insert into " + table + "(" + keyValues.keys.join(",") + ") values (" + keyValues.values.join(",") + ")";
		return executeSQL(sql);
	}
	
	function whereKeyValue(wheres){
		let arrWhere = [];
		for(let k in wheres){
			if(wheres[k] === null){
				arrWhere.push( k + " is null");
			}else{
				arrWhere.push( k + "=" + escape(wheres[k]));
			}
		}
		return arrWhere;
	}
	
	function keyAndValue(keyValues){
		let arrSet = [];
		for(let k in keyValues){
			arrSet.push( k + "=" + escape(keyValues[k]));
		}
		return arrSet;
	}
	
	function update(table, keyValues, wheres){
		let arrSet = keyAndValue(keyValues);
		let arrWhere = whereKeyValue(wheres);
		let sql = "update " + table + " set " + arrSet.join(",") + " where " + arrWhere.join(" AND ");
		return executeSQL(sql);
	}
	
	function deleteItem(table, wheres){
		let arrWhere = whereKeyValue(wheres);
		let sql = "delete from " + table + " where " + arrWhere.join(" and ");
		return executeSQL(sql);
	}
	
	// 查询SQL语句
	function selectSQL(sql){
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: DB_NAME,
				sql: sql,
				success: function(data){
					// console.log(sql, 'result:');
					// console.log(JSON.stringify(data));
					resolve(data);
				},
				fail: function(e){
					console.log('selectSql failed: '+JSON.stringify(e));
					reject(e);
				}
			});
		});
	}
	
	function select(table, wheres, page, limit, orderBy){
		page = page || 1;
		limit = limit || 10;
		
		if(!(wheres instanceof Array) && wheres instanceof Object){
			let tmp = [];
			for(let t in wheres){
				tmp.push({
					key: t,
					op: wheres[t] === null ? 'is' : '=',
					value: wheres[t],
				});
			}
			wheres = tmp;
		}
		
		let arrWhere = [];
		for(let k in wheres){
			arrWhere.push( wheres[k].key +" "+ wheres[k].op + " " + escape(wheres[k].value));
		}
        
        let order = "";
        if(orderBy){
            order = " order by " + orderBy.join(", ");
        }
		
		let limitOffset = " limit " + limit + " offset " + (page - 1) * limit;
		let sql = "select * from " + table + (arrWhere.length>0 ? " where " + arrWhere.join(" and ") : "") + " " + order + limitOffset;
		return selectSQL(sql);
	}
	
	function checkOpenDB(){
		if(!isOpenDatabase()){
			return openDB();
		}else{
			//throw new Error('数据库失败');
		}
        return true;
	}

	var exportsFunc = {
		setConfig,
		checkOpenDB,
        
        executeSQL,
        selectSQL,
        
		beginTransactionDB,
		commitTransactionDB,
		rollbackTransactionDB,
		
		insert,
        deleteItem,
		update,
		select,
	};

	if (typeof define === 'function' && define.amd) {
	  define(function () {
	    return exportsFunc
	  })
	} else if (typeof module === 'object' && module.exports) {
	   module.exports = exportsFunc
	} else {
	  $.DB = exportsFunc
	}
})(this);