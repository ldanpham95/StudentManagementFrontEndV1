// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

	// Populate the user table on initial page load
	populateTable();
	
	// Add Student button click
    $('#btnAddStudent').on('click', addStudent);
	
	// Edit Student link click
	$('#studentList table tbody').on('click', 'td a.linkeditstudent', editSubmitStudent);
	
	// Edit Student button click
	$('#btnEditStudent').on('click', editStudent);

	// Delete Student link click
	$('#studentList table tbody').on('click', 'td a.linkdeletestudent', deleteStudent);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( 'http://localhost:24716/api/student', function( data ) {

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
			console.log(this);
			tableContent += '<tr>';
			tableContent += '<td>' + this.MSSV + '</td>';
			tableContent += '<td><a href="#" class="linkshowstudent" rel="' + this.hoten + '">' + this.hoten + '</a></td>';
			tableContent += '<td><span class="ngaysinh">' + this.ngaysinh.split('T')[0] + '</span></td>';
			tableContent += '<td><span class="lop">' + this.lop + '</span></td>';
			tableContent += '<td><span class="diemtongket">' + (Math.round(this.diemtongket * 10) / 10).toFixed(1) + '</span></td>';
			tableContent += '<td><a href="#" class="linkeditstudent" rel="' + this.MSSV + '">edit</a></td>';
			tableContent += '<td><a href="#" class="linkdeletestudent" rel="' + this.MSSV + '">delete</a></td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#studentList table tbody').html(tableContent);
		});
};

// Add Student
function addStudent(event) {
    event.preventDefault();
	
	var dob = $('#addStudent fieldset input#inputDoB').val() + "T00:00:00";
	console.log("dob = " + dob);

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addStudent input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newStudent = {
			'hoten': $('#addStudent fieldset input#inputName').val(),
			'lop': $('#addStudent fieldset input#inputClass').val(),
			'ngaysinh': dob,
			'diemtongket': $('#addStudent fieldset input#inputScore').val()
		}

        // Use AJAX to post the object to our addStudent service
        $.ajax({
            type: 'POST',
			data: JSON.stringify(newStudent),
            url: 'http://localhost:24716/api/student',
			headers: {
                'Content-Type': "application/json",
                'Accept': 'application/json',
            },
            dataType: 'JSON',
			success: function( response ) {
			},
			complete: function (response) {
				console.log(response.status); // 201
				if (response.status == 201) {
					console.log("Success adding " + newStudent);

					// Clear the form inputs
					$('#addStudent fieldset input').val('');

					// Update the table
					populateTable();
				} else console.log("COMPLETE FAILED");
			}
		});
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

//Edit Student
function editSubmitStudent(event) {
	event.preventDefault();
	
	$('#editStudent fieldset input#inputID').val($(this).attr('rel'));
	$('#editStudent fieldset input#inputName').val($(this).parent().parent().find("a.linkshowstudent").text());
	$('#editStudent fieldset input#inputDoB').val($(this).parent().parent().find("span.ngaysinh").text());
	$('#editStudent fieldset input#inputClass').val($(this).parent().parent().find("span.lop").text());
	$('#editStudent fieldset input#inputScore').val($(this).parent().parent().find("span.diemtongket").text());
}

function editStudent(event) {
    event.preventDefault();
	
	var dob = $('#editStudent fieldset input#inputDoB').val() + "T00:00:00";
	console.log("dob = " + dob);

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#editStudent input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var editStudent = {
			'MSSV': $('#editStudent fieldset input#inputID').val(),
			'hoten': $('#editStudent fieldset input#inputName').val(),
			'lop': $('#editStudent fieldset input#inputClass').val(),
			'ngaysinh': dob,
			'diemtongket': $('#editStudent fieldset input#inputScore').val()
		}

        // Use AJAX to post the object to our addStudent service
        $.ajax({
            type: 'PUT',
			data: JSON.stringify(editStudent),
            url: 'http://localhost:24716/api/student/' + $('#editStudent fieldset input#inputID').val(),
			headers: {
                'Content-Type': "application/json",
                'Accept': 'application/json',
            },
            dataType: 'JSON',
			success: function( response ) {
			},
			complete: function (response) {
				console.log(response.status); // 204
				if (response.status == 204) {
					console.log("Success editing " + editStudent);

					// Clear the form inputs
					$('#editStudent fieldset input').val('');

					// Update the table
					populateTable();
				} else console.log("COMPLETE FAILED");
			}
		});
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Student
function deleteStudent(event) {
	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this student?');

	// Check and make sure the user confirmed
	if (confirmation === true) {

		// If they did, do our delete
		$.ajax({
			type: 'DELETE',
            url: 'http://localhost:24716/api/student/' + $(this).attr('rel'),
            dataType: 'JSON',
			success: function( response ) {
			},
			complete: function (response) {
				console.log(response.status); // 201
				if (response.status == 204) {
					console.log("Success deleted");

					// Clear the form inputs
					$('#addStudent fieldset input').val('');

					// Update the table
					populateTable();
				} else console.log("COMPLETE FAILED");
			}
		});

	}
	else {

		// If they said no to the confirm, do nothing
		return false;

	}

};