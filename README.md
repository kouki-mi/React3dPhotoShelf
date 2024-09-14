## 概要
これはReactThreeFiber(https://github.com/pmndrs/react-three-fiber)を使用して画像を立体的に表示するアプリです。<br/>
URLを開くと以下のデモのような形で画像が表示されます。
現在は自分の好きなVtuberの画像を表示しています。

## デモ
URL: https://du0x9iwbi3g0v.cloudfront.net

## 使用した主な技術
- typeScript
- three.js
- react
- next.js
- react-three-fiber
- aws(s3上にデプロイ)

## インフラ環境
AwsのS3上に配置しており、cloudFrontを経由して配信しています。<br/>
また、GitHub Actionsを用いてブランチへのマージをトリガーに自動デプロイされるようにしています。

## 今後の追加機能
- 現在AR.jsを使用して現実の空間上に、この画像オブジェクトを表示させるための機能を実装中です。