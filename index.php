<!DOCTYPE html>
<html>
<head>
        <title>PlayStation Home</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="css/bulma.css">
        <link rel="stylesheet" href="css/index.css">
</head>
<body>
    <header> <sup> Schneider </sup><sub>Electric</sub> &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; Project PlayStation</div> </header>

    <form action="rules.php" method="POST" >
        Project Name<br>
        <input type="text" name="name"><br><br>
        Project Requestor<br>
        <input type="text" name="requestor"><br><br>
        Development Stage<br>
        <select name="stage" style="width: 160px;">
            <option>select</option>
            <option>DEV</option>
            <option>UAT</option>
            <option>PPR</option>
            <option>PROD</option>
        </select><br><br>



        <button type="submit" name="projectSubmit" value="Submit" class="button is-success is-rounded">Next></button>

    </form>
      
</body>
</html>