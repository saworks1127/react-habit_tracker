# react-habit_tracker
習慣トラッカー（チェックイン＋ミニリマインダー）

狙い：フォームの複雑化（週次ルール等）＋時刻ベース副作用の正確化
	•	必須機能
	•	習慣作成フォーム：title, daysOfWeek[], targetTime, notes?
	•	当日のチェックイン＆履歴（カレンダー風UI）
	•	目標時刻±数分の通知（ページ開いている間のみでもOK）
	•	状態管理
	•	habits（定義）とentries（実績）を分離
	•	メモリ→localStorage 永続化
	•	厳密タイマー
	•	次の“目標時刻”までの残りを一発計算し、setTimeoutでスケジュール
	•	バックアップでrequestAnimationFrame駆動の“時刻差再計算”を数分おきに
	•	型安全
	•	曜日/時刻の型（DayOfWeek = 0..6、HH:mmのパース器）を定義
	•	伸び（PWA）
	•	SW＋Background Syncでオフライン時のチェックインを後送信（今回はローカル完結でも、拡張の布石）
