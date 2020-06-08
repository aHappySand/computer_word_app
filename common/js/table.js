import DB from './db.js'
import myConf from "../myConf";
(function ($){
    const DB_PATH = "_doc/data/word.db"
    const DB_NAME = "word";
    
    DB.setConfig({
        db_path: DB_PATH,
        db_name: DB_NAME,
    });
    
    const TABLE_WORD = "word";
    const TABLE_DETAIL = "detail"; 
    const TABLE_WEB_DETAIL = "web_detail";
    const TABLE_VIEW = "view"; 
    
    
    
	function _init(){
        
        plus.io.getFileInfo({
            filePath: DB_PATH,
            success:function(res){
                DB.checkOpenDB();
            },
            fail: function(res){
                if(res.code == -4){//没有就从服务器下载
                    downloadDb();
                }
            }
        });
        return;
		// closeDB();
		
		DB.checkOpenDB();
		
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
    
    function downloadDb(){
        var dtask = plus.downloader.createDownload(myConf.CONFIG_API_BASE_URL + "/public/data/word.db", 
        {filename: DB_PATH}, function(d, status){
            // 下载完成
            if(status == 200){ 
                console.log("Download success: " + d.filename);
            } else {
                 console.log("Download failed: " + status); 
            }  
        });
        //dtask.addEventListener("statechanged", onStateChanged, false);
        dtask.start(); 
    }
    
    function moveData(){
        plus.io.resolveLocalFileSystemURL( "_www/static/_data/word.db", function( fileEntry ) {
            plus.io.resolveLocalFileSystemURL( "_doc/_data", function( dstEntry ) {
                fileEntry.moveTo( dstEntry, "word.db", function( entry ){
                    plus.console.log("New Path: " + entry.fullPath);
                }, function( e ){
                    alert( e.message );
                } );
            });
        });
    }
    
    function syncData(){
        return Db.checkOpenDB()
        .then(_createTable);
    }
	
	function _clearTable(){
		DB.executeSQL("DROP TABLE word");
		
		DB.executeSQL("DROP TABLE detail");
		
		DB.executeSQL("DROP TABLE web_detail");
		
		DB.executeSQL("DROP TABLE view");
	}
	
    
    function _createTableWord(){
        var wordSql = "create table if not exists word" +
        			"(" + 
        			"   id                   INTEGER primary key AUTOINCREMENT not null," + 
        			"   spell                varchar(200)," +
        			"   first_case           char(1)," +
        			"   phonetic             varchar(100)," +
        			"   us_phonetic          varchar(100)," +
        			"   uk_phonetic          varchar(100)," +
        			"   translation          varchar(255)," +
                    "   mark                 INTEGER," +
                    "   is_sync              INTEGER," +
                    "   is_correct           INTEGER," +
                    "   create_time          INTEGER," +
                    "   update_time          INTEGER" +
        			")";
        return DB.executeSQL(wordSql);
    }
    
    function _createTableIndex(){
        var uSql = "CREATE UNIQUE INDEX i_word_spell on word (spell)";
        return DB.executeSQL(uSql);
    }
    
    function _createTableDetail(){
        var dSql = "create table if not exists detail" +
        			"(" + 
        			"   id                   INTEGER primary key AUTOINCREMENT not null," + 
        			"   word_id          INTEGER not null," +
        			"   word_type            varchar(10)," +
        			"   translation          varchar(255)," +
                    "   create_time          INTEGER," +
                    "   update_time          INTEGER" +
        			")";
        return DB.executeSQL(dSql);
    }
    
    function _createTableWebDetail(){
        var webdSql = "create table if not exists web_detail" +
        			"(" + 
        			"   id                   INTEGER primary key AUTOINCREMENT not null," + 
        			"   word_id              INTEGER not null," +
        			"   spell                varchar(255)," +
        			"   translation          varchar(255)," +
                    "   create_time          INTEGER," +
                    "   update_time          INTEGER" +
        			")";
        return DB.executeSQL(webdSql);
    }
    
    function _createTableView(){
        var vSql = "create table if not exists view" +
        			"(" + 
        			"   id                   INTEGER primary key AUTOINCREMENT not null," + 
        			"   word_id              INTEGER not null," +
        			"   spell                varchar(200)," +
        			"   num           		 INTEGER," +
                    "   mark           		 INTEGER," +
        			"   latest_time          INTEGER," +
                    "   create_time          INTEGER," +
                    "   update_time          INTEGER" +
        			")";
        return DB.executeSQL(vSql);
    }
    
	function _createTable(){
        return _createTableWord()
        .then(_createTableIndex)
        .then(_createTableDetail)
        .then(_createTableWebDetail)
        .then(_createTableView);
	}
	
	function _insertData(){
		
	}
	
	_init();
    
	function insertWord(keyValues){
		DB.checkOpenDB();
		keyValues['first_case'] = keyValues.spell.slice(0, 1).toLowerCase();
		let pr = DB.insert(TABLE_WORD, keyValues);
		return pr;
	}
	
	function getLatestWordId(fun){
		return DB.selectSQL("select id from " + TABLE_WORD + " order by id desc limit 1").then(function(res){
			fun(res[0]["id"]);
		});
	}
	
	function updateWord(keyValues, wheres){
		DB.checkOpenDB();
		return DB.update(TABLE_WORD, keyValues, wheres);
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
		return DB.select(TABLE_WORD, where, page);
	}
	
	function selectWordByOther(wheres, page){
		return DB.select(TABLE_WORD, wheres, page);
	}
	
	function insertDetail(keyValues){
		DB.checkOpenDB();
		return DB.insert(TABLE_DETAIL, keyValues);
	}
	
	function updateDetail(keyValues, wheres){
		DB.checkOpenDB();
		return DB.update(TABLE_DETAIL, keyValues, wheres);
	}
	
	function selectDetail(wordId){
		let where = [{
			key: 'word_id',
			op: '=',
			value: wordId
		}];
		return DB.select(TABLE_DETAIL, where);
	}
	
	function insertWebDetail(keyValues){
		DB.checkOpenDB();
		return DB.insert(TABLE_WEB_DETAIL, keyValues);
	}
	
	function updateWebDetail(keyValues, wheres){
		DB.checkOpenDB();
		return DB.update(TABLE_WEB_DETAIL, keyValues, wheres);
	}
	
	function selectWebDetail(wordId){
		let where = [{
			key: 'word_id',
			op: '=',
			value: wordId
		}];
		return DB.select(TABLE_WEB_DETAIL, where);
	}
	
	function insertView(keyValues){
		DB.checkOpenDB();
		keyValues['latest_time'] = Date.now() / 1000;
		return DB.insert(TABLE_VIEW, keyValues);
	}
	
	function selectView(wordId, page){
		let where = [{
			key: 'word_id',
			op: '=',
			value: wordId
		}];
		return DB.select(TABLE_VIEW, where, page);
	}
    
    function saveWord(wordData){
        var word = wordData.word,
            details = wordData.detail;
            webDetails = wordData.webDetail;
        
        insertWord(word).then(function(res){
            getLatestWordId((id) => {
                if(details){
                    for(let k in details){
                        let detail = details[k];
                        if(detail.translation){
                            detail['word_id'] = id;
                            insertDetail(detail);
                        }
                    }
                }
            	if(webDetails){
                    for(let k in webDetails){
                        let detail = webDetails[k];
                        if(detail.translation){
                            detail['word_id'] = id;
                            _this.$DB.insertWebDetail(detail);
                        }
                    }
                }
            });
        });
    }
    
    function saveChineseWord(chinese, trans){
        DB.checkOpenDB();
        return DB.insert('chinese', {'chinese': chinese}).then(function(res1){
            DB.selectSQL("select id from chinese order by id desc limit 1").then(function(res2){
                let id = res2[0]["id"];
                for(let k in trans){
                    DB.insert('only_word', {'spell': trans[k]}).then(function(res3){
                        DB.selectSQL("select id from only_word order by id desc limit 1").then(function(res4){
                            let wId = res4[0]["id"];
                            DB.insert('chinese_word', {'chinese_id': id, 'word_id': wId});
                        });
                    });
                }
            });
        });
        
        insertWord(word).then(function(res){
            getLatestWordId((id) => {
                if(details){
                    for(let k in details){
                        let detail = details[k];
                        if(detail.translation){
                            detail['word_id'] = id;
                            insertDetail(detail);
                        }
                    }
                }
            	if(webDetails){
                    for(let k in webDetails){
                        let detail = webDetails[k];
                        if(detail.translation){
                            detail['word_id'] = id;
                            _this.$DB.insertWebDetail(detail);
                        }
                    }
                }
            });
        });
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
		selectView,
        
        saveChineseWord,
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