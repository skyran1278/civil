function readAccountData() {
    let str = `
        <thead>
            <tr>
                <th class="col-md-1"></th>
                <th class="col-md-2">Title</th>
                <th class="col-md-2">Type</th>
                <th class="col-md-2">Number</th>
                <th class="col-md-2">Time</th>
                <th class="col-md-2">Edit</th>
                <th class="col-md-1"></th>
            </tr>
        </thead>
    `;
    const accountRef = database.ref('skyran/');
    const infoRef = document.querySelector('#data-chart-info');
    const dataTableRef = document.querySelector('#data-table');

    accountRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data === null) {
            dataTableRef.innerHTML = '<h4>Creat New Expense</h4>';
            infoRef.innerHTML = '<h4>Have no data</h4>';
        } else {
            loadChart(data);

            const arrs = [];
            let i = 0;
            Object.keys(data).forEach((key) => {
                arrs[i] = [];
                arrs[i].push(data[key].date);
                arrs[i].push(data[key].title);
                arrs[i].push(data[key].type);
                arrs[i].push(data[key].number);
                arrs[i].push(key);
                i += 1;
            });

            arrs.sort((a, b) => {
                if (a < b) return 1;
                if (a > b) return -1;
                return 0;
            });

            arrs.forEach((key) => {
                // console.log(key);
                str +=
                    `
                <tr>
                    <td></td>
                    <td>${key[1]}</td>
                    <td>${key[2]}</td>
                    <td>$ ${key[3]}</td>
                    <td>${key[0]}</td>
                    <td>
                        <button type="button" class="btn btn-primary update-btn" data-id="${key[4]}">Update</button>
                        <button type="button" class="btn btn-danger delete-btn" data-id="${key[4]}">Delete</button>
                    </td>
                    <td></td>
                </tr>
                `;
            });
            document.querySelector('#data-table').innerHTML = str;
            updateBtnListener();
            deleteBtnListener();
        }
    });
}