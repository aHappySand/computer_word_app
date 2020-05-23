(function ($){
	const DB_PATH = "_doc/word.db";
	const DB_NAME = "word";
	const TABLE_WORD = "word"; 
	const TABLE_DETAIL = "detail"; 
	const TABLE_WEB_DETAIL = "web_detail";
	const TABLE_VIEW = "view"; 
		
	function _init(){
		// closeDB();
		
		checkOpenDB();
		
		// _clearTable();
		// _createTable();
		
		let r = selectWord("c");
		
		r.then(function(e){
			// _insertData();
		}).catch(function(e){
			console.log(e);
			// _createTable();
			// _insertData();
		});
	}
	
	function _clearTable(){
		executeSQL("DROP TABLE word");
		
		executeSQL("DROP TABLE detail");
		
		executeSQL("DROP TABLE web_detail");
		
		executeSQL("DROP TABLE view");
	}
	
	function _createTable(){
		var wordSql = "create table if not exists word" + 
					"(" + 
					"   id                   INTEGER primary key AUTOINCREMENT not null," + 
					"   spell                varchar(200)," +
					"   first_case           char(1)," +
					"   phonetic        varchar(100)," +
					"   us_phonetic        varchar(100)," +
					"   uk_phonetic        varchar(100)," +
					"   translation           varchar(255)" +
					")";
		executeSQL(wordSql);
		
		var dropSql = "DROP INDEX i_word_spell";
		executeSQL(dropSql);
				
		 var uSql = "CREATE UNIQUE INDEX i_word_spell on word (spell)";
				executeSQL(uSql);
				
		
		var dSql = "create table if not exists detail" +
					"(" + 
					"   id                   INTEGER primary key AUTOINCREMENT not null," + 
					"   word_id          INTEGER not null," +
					"   word_type            varchar(10)," +
					"   translation          varchar(255)" +
					")";
		executeSQL(dSql);
		
		var webdSql = "create table if not exists web_detail" +
					"(" + 
					"   id                   INTEGER primary key AUTOINCREMENT not null," + 
					"   word_id          INTEGER not null," +
					"   spell            varchar(255)," +
					"   translation          varchar(255)" +
					")";
		executeSQL(webdSql);
		
		var vSql = "create table if not exists view" +
					"(" + 
					"   id                   INTEGER primary key AUTOINCREMENT not null," + 
					"   word_id          INTEGER not null," +
					"   spell                varchar(200)," +
					"   num           		 INTEGER," +
					"   latest_time          INTEGER" +
					")";
		executeSQL(vSql);
	}
	
	function _insertData(){
		let words = [
			{
				spell:'command',
				phonetic: '[kəˈmænd]',
				translation: '命令',
			}
		];
		for(var i in words){
			insertWord(words[i]).then(function(res){
				console.log(res);
				
			});
		}
		
		let details = [
			{
				word_id: 1,
				word_type: 'n',
				translation: "(给人或动物的)命令';指令;命令;控制;管辖;指挥",
			},
			{
				word_id: 1,
				word_type: 'v',
				translation: '命令;指挥，统率(陆军、海军等);应得;博得;值得',
			}
		];
		for(var i in details){
			insertDetail(details[i]).then(function(res){
				console.log(res);
			}).catch(function(e){
				console.log(e);
			});
		}
	}
	
	_init();
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
					console.log(sql);
					console.log('executeSql success!');
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
		console.log(typeof null);
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
		console.log(arrSet);
		let arrWhere = whereKeyValue(wheres);
		console.log(arrWhere);
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
					console.log(sql, 'result:');
					console.log(JSON.stringify(data));
					resolve(data);
				},
				fail: function(e){
					console.log('selectSql failed: '+JSON.stringify(e));
					reject(e);
				}
			});
		});
	}
	
	function select(table, wheres, page, limit){
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
		
		let limitOffset = "limit " + limit + " offset " + (page - 1) * limit;
		let sql = "select * from " + table + " where " + arrWhere.join(" and ") + " " + limitOffset;
		return selectSQL(sql);
	}
	
	function checkOpenDB()
	{
		if(!isOpenDatabase()){
			return openDB();
		}else{
			//throw new Error('数据库失败');
		}
	}
	
	function insertWord(keyValues){
		checkOpenDB();
		keyValues['first_case'] = keyValues.spell.slice(0, 1).toLowerCase();
		let pr = insert(TABLE_WORD, keyValues);
		return pr;
	}
	
	function getLatestWordId(fun){
		return selectSQL("select id from " + TABLE_WORD + " order by id desc limit 1").then(function(res){
			fun(res[0]["id"]);
		});
	}
	
	function updateWord(keyValues, wheres){
		checkOpenDB();
		return update(TABLE_WORD, keyValues, wheres);
	}
	
	/**
	 * @param {string} spell 单词搜索
	 */
	function selectWord(spell, page){
		let where = [{
			key: 'spell',
			op: 'like',
			value: spell + '%'
		}];
		return select(TABLE_WORD, where, page);
	}
	
	function selectWordByOther(wheres, page){
		return select(TABLE_WORD, wheres, page);
	}
	
	function insertDetail(keyValues){
		checkOpenDB();
		return insert(TABLE_DETAIL, keyValues);
	}
	
	function updateDetail(keyValues, wheres){
		checkOpenDB();
		return update(TABLE_DETAIL, keyValues, wheres);
	}
	
	function selectDetail(wordId){
		let where = [{
			key: 'word_id',
			op: '=',
			value: wordId
		}];
		return select(TABLE_DETAIL, where);
	}
	
	function insertWebDetail(keyValues){
		checkOpenDB();
		return insert(TABLE_WEB_DETAIL, keyValues);
	}
	
	function updateWebDetail(keyValues, wheres){
		checkOpenDB();
		return update(TABLE_WEB_DETAIL, keyValues, wheres);
	}
	
	function selectWebDetail(wordId){
		let where = [{
			key: 'word_id',
			op: '=',
			value: wordId
		}];
		return select(TABLE_WEB_DETAIL, where);
	}
	
	function insertView(keyValues){
		checkOpenDB();
		keyValues['latest_time'] = Date.now() / 1000;
		return insert(TABLE_VIEW, keyValues);
	}
	
	function selectView(wordId, page){
		let where = [{
			key: 'word_id',
			op: '=',
			value: wordId
		}];
		return select(TABLE_VIEW, where, page);
	}

	var exportsFunc = {
		insertWord,
		updateWord,
		selectWord,
		selectWordByOther,
		getLatestWordId,
		
		insertDetail,
		updateDetail,
		selectDetail,
		
		insertWebDetail,
		updateWebDetail,
		selectWebDetail,
		
		insertView,
		selectView
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