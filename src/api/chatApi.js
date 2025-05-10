// API設定
const API_KEY = '';
const API_URL = 'https://api.dify.ai/v1/chat-messages';

// 固定のユーザーID
const USER_ID = 'user-1';

/**
 * チャットメッセージを送信する
 * @param {string} message - ユーザーのメッセージ
 * @param {string} conversationId - 会話ID
 * @param {string} topic - トピック
 * @returns {Promise<Object>} - APIレスポンス
 */
export const sendChatMessage = async (message, conversationId, topic) => {
    // リクエストボディの作成
    const requestBody = {
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId,
        user: USER_ID,
        inputs: {
            topics: topic // トピックを文字列として追加
        }
    };

    // デバッグ情報の表示
    console.log('リクエストURL:', API_URL);
    console.log('リクエストヘッダー:', {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    });
    console.log('リクエストボディ:', requestBody);

    // APIリクエスト
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    // レスポンスの詳細をログ出力
    console.log('レスポンスステータス:', response.status);
    console.log('レスポンスヘッダー:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
        const errorText = await response.text();
        console.error('エラーレスポンス:', errorText);
        throw new Error(`APIリクエストに失敗しました: ${response.status} ${errorText}`);
    }

    // レスポンスをJSONとして解析
    const data = await response.json();
    console.log('レスポンスデータ:', data);

    return data;
};
