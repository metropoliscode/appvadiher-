<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
        }

        .page {
            width: 100%;
            page-break-after: always;
            overflow: hidden;
        }

        .ticket {
            float: left;
            width: 45%;
            min-height: auto;
            border: 1px solid #000;
            margin: 1%;
            box-sizing: border-box;
            font-size: 15px;
        }

        .clearfix {
            clear: both;
        }

        .ticket table {
            width: 100%;
            border-collapse: collapse;
        }

        .ticket td {
            border: 1px solid #000;
            padding: 3px 4px;
            word-break: break-word;
            text-align: center;
            vertical-align: middle;
            white-space: normal;
        }

        .ticket .label {
            font-weight: bold;
            background-color: #f0f0f0;
        }

        .ticket .data-row td {
            background-color: #fcfcfc;
            font-size: 13px;
        }
    </style>
</head>
<body>
    @foreach ($tickets->chunk(18) as $chunk)
        <div class="page">
            @foreach ($chunk as $index => $ticket)
                @php
                    $nombre = $ticket->ref_nombre;
                    $fontSize = strlen($nombre) > 60 ? 10 : (strlen($nombre) > 35 ? 12 : 14);
                @endphp
                <div class="ticket">
                    <table>
                        <tr>
                            <td class="label">REFERENCIA</td>
                            <td class="label">CODIGO</td>
                            <td class="label">UNMED</td>
                        </tr>
                        <tr>
                            <td>{{ $ticket->ref_refere }}</td>
                            <td>{{ $ticket->ref_codigo }}</td>
                            <td>{{ $ticket->ref_undmed }}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="
                                font-weight: bold;
                                font-size: {{ $fontSize }}px;
                                text-align: center;
                                border-top: 2px solid #000;
                                word-wrap: break-word;
                                overflow-wrap: break-word;
                                white-space: normal;
                                line-height: 1.2em;
                                padding: 2px;">
                                {{ $ticket->ref_nombre }}
                            </td>
                        </tr>
                    </table>
                </div>
                @if(($index + 1) % 2 == 0)
                    <div class="clearfix"></div>
                @endif
            @endforeach
        </div>
    @endforeach
</body>
</html>
