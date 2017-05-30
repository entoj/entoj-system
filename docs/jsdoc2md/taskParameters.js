exports.taskParameters = function(tags)
{
    const result = [];
    tags.forEach(function(item)
    {
        if (item.tag == 'taskparameter')
        {
            console.log(item);
            const param =
            {
                name: '[Whatever]',
                type:
                {
                    names:['Object']
                },
                description: 'Mega Nice Description'
            };
            result.push(param);
        }
    });
    return result;
};
