<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Answers List</title>
</head>
<body>
<h2>Customer: {{ $customer->name }}</h2>

<div class="wew" style="width: 60%">
    <div style="float: left; width: 50%">
        @foreach($survey->blocks as $block)
            @foreach($block->question as $question)
                <p>
                    @if($answer = $question->customerAnswer()->where('customer_id', $customer->id)->first())
                        {{$question->title.' - '.$answer->value}}
                    @endif
                </p>
            @endforeach
        @endforeach
    </div>
</div>
</body>
</html>